class TimeLine {
  
  constructor(peaks, position, size) {
    this.peaks = peaks.map((p) => abs(p));
    this.position = position
    this.size = size        
    this.sections = TimeLine.chop(this.peaks)
    this.colors = TimeLine.colors(this.peaks, this.sections)
    
    this.margin = 1/10 * width / 2
  }

  drawTimeLine() {
    let separator = true    
    for(let i = 0; i < this.peaks.length; i++) {
      if (!separator) {
        stroke(this.colors[i])        
        let x = 2 * i
        let level = this.peaks[i] * this.size      
        line(x, this.position + level, x, this.position - level)
      }
      separator = !separator
    }  
  }

  drawCurrentTime(currentTime, duration) {
    stroke(WHITE)
    strokeWeight(1.5 * LINE)
    let currentWidth = 6
    let current = map(currentTime, 0, duration, 0, width)
    rect(current, this.position, currentWidth, this.size)
    
    line(current - currentWidth / 2, this.position + this.size / 2, this.margin, this.position + this.size / 2 + this.margin)
    line(current + currentWidth / 2, this.position + this.size / 2, width - this.margin, this.position + this.size / 2 + this.margin) 
    strokeWeight(LINE)
  }
  
  drawWave(amplitude) {
    stroke(WHITE)
    strokeWeight(1.5 * LINE)
    let waveWidth = width - this.margin * 2
    beginShape()
    for(var i = 0; i < waveWidth; i++) {    
      let x = i + this.margin
      var index = floor(map(i, 0, width, 0, amplitude.length))    
      var y = map(amplitude[index], 0 , 1, 0, this.size) + this.position * 2 + this.margin
      vertex(x, y)
    }
    endShape()
    rect(width / 2, this.position * 2 + this.margin, waveWidth, this.size)
    strokeWeight(LINE)
  }
  
  static average(values) {
    return values.reduce((total, value) => (total + value)) / values.length;
  }

  static median(values) {
    const mid = floor(values.length / 2),
      nums = [...values].sort((a, b) => a - b);
    return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }
  
  static standardDeviation(values, mean) {
      return sqrt(values.map(x => pow(x - mean, 2)).reduce((a, b) => a + b) / values.length)
  }
  
  static variationAverage(values) {
    let result = 0
    for(let i = 1; i < values.length; i++) {      
      result += abs(values[i] - values[i - 1]) / (i + 1)      
    }
    return result;
  }
  
  static colors(peaks, sections) {    
    const totalAverage = TimeLine.average(peaks)
    const standardDeviation = TimeLine.standardDeviation(peaks, totalAverage)
    let currentColor = GREEN
    let colors = []
    let j = 0
    
    for(let i = 0; i < peaks.length; i++) {
      if (i == sections[j]) {        
        const sectionAverage = TimeLine.average(peaks.slice(i, sections[j + 1]))
        if (sectionAverage > totalAverage + standardDeviation) {
          currentColor = RED
        } else if (sectionAverage < totalAverage - standardDeviation) {
          currentColor = GREEN
        } else {          
          currentColor = YELLOW
        }
        j++
      }
      colors.push(currentColor)
      
      
    }
    return colors
  }
  
  static chop(peaks) {    
    const variationAverage = TimeLine.variationAverage(peaks)
    print('Variation Average:', variationAverage)
    let currentSection = [peaks[0]]
    let sections = [0]
    for(let i = 1; i < peaks.length; i++) {      
      let difference = peaks[i] - TimeLine.average(currentSection)
      if (abs(difference) > variationAverage) {
        sections.push(i)
        currentSection.length = 0
      }
      currentSection.push(peaks[i])
    }
    print('Sections:', sections)
    return sections
  }
  
  static chopWithThresholds(peaks) {    
    const totalAverage = TimeLine.average(peaks)
    const minSectionSize = peaks.length / 20 // Should be dynamic
    const minVolumeDifference = 0.1 // Should be based on some maximum average    
    print('Average:', totalAverage)
    print('Median:', TimeLine.median(peaks))
    print('Standard Deviation:', TimeLine.standardDeviation(peaks, totalAverage))
    print('Min section size:', minSectionSize)
    print('Min Difference:', minVolumeDifference)    
    let currentSection = [peaks[0]]
    let sections = [0]
    for(let i = 1; i < peaks.length; i++) {
      if (currentSection.length > minSectionSize) { // To discard annomaly peaks        
        let difference = peaks[i] - TimeLine.average(currentSection)
        if (abs(difference) > minVolumeDifference) { // To discard small differences
          sections.push(i)
          currentSection.length = 0
        }
      }
      currentSection.push(peaks[i])
    }
    print('Sections:', sections)
    return sections
  }
}