const SIZE = 500
const LINE = 1.5
const BLACK = '#1F1717'
const WHITE = '#FCF5ED'
const RED = '#BE3144'
const ORANGE = '#E48F45'
const GREEN = '#99B080'
const BLUE = '#96EFFF'
const YELLOW = '#F4CE14'

let song
let fft
let peaks
var bassLine
var trebleLine
var frequencies = []
let timeline
let spring

const FREQUENCY_RANGES = [ [20, 140, RED], [140, 400, ORANGE], [400, 2600, YELLOW], [2600, 5200, GREEN], [5200, 14000, BLUE] ]

function preload() {
  //song = loadSound('songs/miaminights.mp3')
  song = loadSound('songs/tomsdiner.mp3')
  //song = loadSound('songs/elements.mp3')
  //song = loadSound('songs/blackbetty.mp3')
  //song = loadSound('songs/allstar.mp3')
  //song = loadSound('songs/lacrimosa.mp3')
}

function setup() {
  createCanvas(SIZE, SIZE)
  background(BLACK)
  stroke(WHITE)
  strokeWeight(LINE)
  noFill()
  rectMode(CENTER)
  fft = new p5.FFT()  
  for(var i = 0; i < FREQUENCY_RANGES.length; i++) {
    frequencies.push(Array(width / 2).fill(0))
  }  
  peaks = song.getPeaks(width / 2)
  timeline = new TimeLine(peaks, height / 7, height / 7)
  spring = new Spring(width / 2, height / 2)  
}

function draw() {
  background(BLACK)
  timeline.drawTimeLine()
  timeline.drawCurrentTime(song.currentTime(), song.duration())
  let frequency = fft.analyze()  
  //drawFrequency(frequency)
  let wave = fft.waveform()
  timeline.drawWave(wave)
  const separation = height / 20
  for(let i = 0; i < frequencies.length; i++) {
    let value = fft.getEnergy(FREQUENCY_RANGES[i][0], FREQUENCY_RANGES[i][1])    
    let paint = FREQUENCY_RANGES[i][2]
    let position = 6/7 * height - i * separation + 2 * separation
    frequencies[i].push(value)
    frequencies[i].shift()
    drawCircle(value, 3/5 * height, paint)
    drawLine(frequencies[i], paint, position)
  }  
}

function drawFrequency(frequency) {
  stroke(WHITE)
  for(i = 0; i < frequency.length; i++) {    
    let x = i        
    let y = map(frequency[i], 0, 256, height, 0)
    line(i, height, i, y)
  }
}

function drawSpring(value) {
  stroke(GREEN)
  circle(3/4 * width, 5/6 * height, value)
  if (value > 30) spring.update(value)
  else spring.update()
  spring.paint()
}

function drawCircle(value, position, circleColor) {
  stroke(circleColor)
  circle(width / 2, position, value)
}

function drawLine(values, lineColor, position) {  
  stroke(lineColor)
  const constraint = height / 6
  beginShape()
  for(let i = 0; i < values.length; i++) {    
      let x = i
      let level = map(values[i], 0, 255, 0, constraint)
      let dampening = i / values.length
      let y = position - level * dampening
      vertex(x, y)    
  }
  endShape()
  beginShape()
  for(let i = 0; i < values.length; i++) {
      let x = width / 2 + values.length - i - 1
      let level = map(values[i], 0, 255, 0, constraint)
      let dampening = i / values.length
      let y = position - level * dampening    
      vertex(x, y)
  }
  endShape()
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}