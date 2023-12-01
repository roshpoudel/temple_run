/*
 * This class simulates a pendulum that swings back and forth.
 * Inspired by minecraft's character animation.
*/

/**
 * Represents a pendulum that swings back and forth.
 */
export class Pendulum {
  // Angular velocity of the pendulum
  dtheta = 0;

  // Current angle of the pendulum
  theta = 0;

  // Maximum swing angle of the pendulum
  maxSwing = Math.PI / 7;

  /**
   * Creates a new Pendulum instance.
   * @param gravity The gravitational force acting on the pendulum.
   * @param damp The damping factor that affects the swing velocity.
   * @param force The force applied to the pendulum when it is active.
   */
  constructor(public gravity: number, public damp: number, public force: number) {
  }

  /**
   * Updates the pendulum's state based on the elapsed time and activity status.
   * @param dt The elapsed time in seconds.
   * @param active Indicates whether the pendulum is active or not.
   */
  public update(dt: number, active: boolean) {
    let swingForce = 0;

    if (active) {
      // Apply force in the direction of swing
      swingForce = (this.dtheta >= 0) ? this.force : -this.force;
    }

    // Calculate the gravitational force acting on the pendulum
    const gravityForce = this.gravity * Math.sin(this.theta);

    // Calculate the total force acting on the pendulum
    const totalForce = swingForce + gravityForce;

    // Update the angular velocity based on the total force and damping factor
    this.dtheta += this.damp * dt * totalForce;

    // Update the angle based on the angular velocity
    this.theta += dt * this.dtheta;

    // Clamping theta to the maxSwing range (+/- certain degrees)
    this.theta = Math.max(-this.maxSwing, Math.min(this.maxSwing, this.theta));

    // Reduce swing velocity if the pendulum is not active
    if (!active) {
      this.dtheta *= (1 - this.damp * dt);
    }
  }

  /**
   * Gets the current swing angle of the pendulum.
   */
  public get swing() {
    return this.theta;
  }
}
