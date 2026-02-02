import type { User, Match } from "../../models/dto/utils/matchMaker/index.js";

class Matchmaker {
  /**
   * Generates a random number using a Gaussian (normal) distribution.
   * Values close to the mean are more likely than far ones.
   * Used to prefer opponents with similar ELO.
   *
   * @param mean Center value of the distribution
   * @param stdDev Standard deviation of the distribution
   * @returns A random number around the mean
   */
  static randomGaussian(mean: number, stdDev: number): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return (
      mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    );
  }

  /**
   * Returns a random ELO between minElo and maxElo.
   * The result is centered around the player's ELO.
   *
   * @param minElo Minimum allowed ELO
   * @param maxElo Maximum allowed ELO
   * @param playerElo ELO of the base player
   * @returns A random ELO value
   */
  static getRandomElo(
    minElo: number,
    maxElo: number,
    playerElo: number,
  ): number {
    const stdDev = (maxElo - minElo) / 6;
    let elo: number;

    do {
      elo = Math.round(this.randomGaussian(playerElo, stdDev));
    } while (elo < minElo || elo > maxElo);

    return elo;
  }

  /**
   * Tries to find a player with ELO close to targetElo using binary search.
   * If found, removes the player from indexArr and returns it.
   * If not found, returns a random available player.
   *
   * @param indexArr Indexes of available players
   * @param players Full players array
   * @param targetElo Desired opponent ELO
   * @param range Allowed ELO difference
   * @returns The selected player or null
   */
  static findAndRemoveBinary(
    indexArr: number[],
    players: User[],
    targetElo: number,
    range: number,
  ): User | null {
    if (!indexArr || indexArr.length === 0) return null;

    let left = 0;
    let right = indexArr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const playerIdx = indexArr[mid];

      if (playerIdx === undefined) {
        right = mid - 1;
        continue;
      }

      const player = players[playerIdx];
      if (!player) {
        this.swapPop(indexArr, mid);
        return null;
      }

      const currentElo = player.stats.elo;

      if (currentElo >= targetElo - range && currentElo <= targetElo + range) {
        this.swapPop(indexArr, mid);
        return player;
      }

      // select the direction using the elo
      if (currentElo < targetElo - range) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Fallback: pick a random player if no close ELO was found
    if (indexArr.length > 0) {
      const randomIndex = Math.floor(Math.random() * indexArr.length);
      const fallbackIdx = indexArr[randomIndex];
      const fallbackPlayer = players[fallbackIdx!];
      this.swapPop(indexArr, randomIndex);
      return fallbackPlayer as User;
    }

    return null;
  }

  /**
   * Picks a random player that has not been matched yet.
   *
   * @param indexArr Indexes of available players
   * @param players Full players array
   * @returns The selected player or null
   */
  static choseRandomPlayer(indexArr: number[], players: User[]): User | null {
    if (indexArr.length === 0) return null;
    const randomPos = Math.floor(Math.random() * indexArr.length);
    const player = players[randomPos];
    player!.has_game = true;
    this.swapPop(indexArr, randomPos);
    return player as User;
  }

  /**
   * Defines the allowed ELO range based on how many players are left.
   * More players = smaller range.
   *
   * @param arrLength Number of remaining players
   * @returns ELO range
   */
  static defineRange(arrLength: number): number {
    if (arrLength < 100) return 1000;
    if (arrLength < 10000) return 500;
    if (arrLength < 100000) return 250;
    if (arrLength < 1000000) return 125;
    return 125;
  }

  /**
   * Removes an element from an array using swap-and-pop (O(1)).
   *
   * @param a Array to modify
   * @param posToRemove Position to remove
   */
  static swapPop(a: number[], posToRemove: number) {
    if (posToRemove < 0 || posToRemove >= a.length) return;
    const last = a.pop();
    if (posToRemove < a.length && last !== undefined) {
      a[posToRemove] = last;
    }
  }

  /**
   * If the number of players is odd, assigns one random player to an AI match.
   *
   * @param players Full players array
   * @param indexArr Indexes of available players
   * @returns AI match object or undefined
   */
  static sanitizeArr(players: User[], indexArr: number[]): Match | undefined {
    if (players.length % 2 !== 0) {
      const randomPick = Math.floor(Math.random() * players.length);
      const lonelyPlayer = players[randomPick];
      this.swapPop(indexArr, randomPick);
      lonelyPlayer!.has_game = true;
      return {
        playerOneId: lonelyPlayer!.id,
        playerTwoId: null,
        is_ai_game: true,
        playerOneElo: lonelyPlayer?.stats.elo as number,
        playerTwoElo: null
      };
    }
  }

  /**
   * Main function: generates matches for all players.
   * Each player appears only once.
   *
   * @param users Sorted array of players
   * @returns List of generated matches
   */
  static *generateMatches(
    users: User[],
  ): IterableIterator<Match | { lastId: string }> {
    if (!users || users.length === 0) {
      yield { lastId: "done" } as any;
      return;
    }

    const indexArr: number[] = users.map((_, i) => i);

    const aiGame = this.sanitizeArr(users, indexArr);
    if (aiGame) {
      yield aiGame;
    }

    const maxElo = users[0]?.stats?.elo ?? 1000;
    const minElo = users[users.length - 1]?.stats?.elo ?? 0;
    let lastProcessedPlayerId = "done";

    while (indexArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * indexArr.length);
      const playerIdx = indexArr[randomIndex];

      if (playerIdx === undefined || !users[playerIdx]) {
        this.swapPop(indexArr, randomIndex);
        continue;
      }

      const basePlayer = users[playerIdx];
      lastProcessedPlayerId = basePlayer.id;
      this.swapPop(indexArr, randomIndex);

      const range = this.defineRange(indexArr.length);
      const targetElo = this.getRandomElo(minElo, maxElo, basePlayer.stats.elo);

      const opponent = this.findAndRemoveBinary(
        indexArr,
        users,
        targetElo,
        range,
      );

      if (opponent) {
        yield {
          playerOneId: basePlayer.id,
          playerTwoId: opponent.id,
          is_ai_game: false,
          playerOneElo: basePlayer.stats.elo,
          playerTwoElo: opponent.stats.elo,
        };
      }
    }

    yield { lastId: lastProcessedPlayerId } as any;
  }
}

export default Matchmaker;
