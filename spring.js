class Spring {
  constructor(x, y) {
    this.x = x
    // Simulation constants
    this.M = 0.8 // Mass
    this.K = 0.2 // Spring constant
    this.D = 0.9 // Damping
    this.R = y // Rest position    
    // Simulation variables
    this.ps = this.R // Position
    this.vs = 0.0 // Velocity
    this.as = 0 // Acceleration
    this.f = 0 // Force
    // Size
    this.size = 5
    this.balls = 20
  }
  
  update(move) {    
    if (!move) {
      this.f = -this.K * (this.ps - this.R); // f=-ky
      this.as = this.f / this.M; // Set the acceleration, f=ma == a=f/m
      this.vs = this.D * (this.vs + this.as); // Set the velocity
      this.ps = this.ps + this.vs; // Updated position
    }
    
    if (move) {
      this.ps = move;      
    }
  }
  
  paint() {
    for(let i = 0; i < this.balls; i++) {
      let dampening = (this.ps - this.R) * (i / this.balls)
      circle(this.x - i * 2 * this.size, this.ps - dampening, this.size)
    }
  }
}