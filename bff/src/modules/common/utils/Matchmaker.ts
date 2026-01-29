import type User from "../../models/interfaces/user.js";

class Matchmaker {
  /**
   * Generates a random number following a Gaussian (normal) distribution.
   * The highest probability is at the mean value, and it decreases smoothly
   * as the value moves farther away from it.
   *
   * This is useful for matchmaking scenarios where values close to the
   * player's ELO should be more likely than distant ones.
   *
   * Example:
   * minElo = 1, maxElo = 1000, playerElo = 50
   * Values near 50 will be selected more frequently than values near 1 or 1000.
   */
  static randomGaussian(mean: number, stdDev: number): number {
    let u = 0;
    let v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return (
      mean + stdDev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    );
  }

  /**
   * Returns a random ELO value constrained between minElo and maxElo.
   * The probability distribution is centered on the player's ELO,
   * meaning opponents with similar ELO are much more likely to be selected.
   *
   * The standard deviation is derived from the allowed ELO range,
   * ensuring most generated values stay within bounds while still
   * allowing occasional wider matches.
   * @param minElo The minimElo included in the array
   * @param maxElo The max elo included in the array
   * @param playerElo The player elo
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
   * Search one user using a binary search pattern and range, return it or a random user if is undefined,
   * If found, removes the player from the array and returns it.
   * @param players Descending sorted array of users
   * @param targetElo Target ELO to match
   * @param range Maximum allowed difference from targetElo (default 100)
   * @param left Left index of current search
   * @param right Right index of current search
   */
  static findAndRemoveBinary(
    players: any[],
    targetElo: number,
    range: number,
  ): any {
    if (players.length === 0) return null;

    let left = 0;
    let right = players.length - 1;
    let candidateIndex: number | null = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2); // start at the middle of the array
      const diff = players[mid].stats.elo - targetElo; 

      if (diff <= range) {
        candidateIndex = mid;
        break;
      }

      //if the elo is biggest that required go to the right else go to the left, because the array is sorted from bigger to lower elo.
      if (diff > range) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (candidateIndex !== null) {
      return players.splice(candidateIndex, 1)[0];
    }

    const randomIndex = Math.floor(Math.random() * players.length);
    return players.splice(randomIndex, 1)[0];
  }

  /**This function takes the length of the array as arg, then return the range for select one player inside this range elo
   * @param arrLength The length of the array
   */
  static defineRange(arrLength: number) {
    if (arrLength < 100) return 1000;
    if (arrLength < 10000) return 100;
    if (arrLength < 100000) return 10;
    if (arrLength < 1000000) return;
  }
}

export default Matchmaker;
