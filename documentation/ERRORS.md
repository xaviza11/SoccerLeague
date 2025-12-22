# Errors

## Simulator

- When simulating a game, the ball is not passed correctly.  
  This happens because, instead of creating objects with the passing probabilities like this:

### Example: Goalkeeper
```json
{
  "Defender": 30,
  "Striker": 1,
  ...
}

and using these probabilities to randomly select a receiver,

the simulator creates a Gaussian bell curve that distributes the passing probabilities based on the array of players:

["Goalkeeper", "Right_Back", "Defender", "Defender", "Left_Back", "Right_Midfield"]

This is incorrect because if the Right_Back has the ball, they should have a higher probability of passing to the Left_Back than to the Right_Midfield,
 even though the latter is technically closer than the Left_Back.