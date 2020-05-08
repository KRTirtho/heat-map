var colorbrewer = {
    RdYlBu: {
      3: ["#fc8d59", "#ffffbf", "#91bfdb"],
      4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
      5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
      6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
      7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
      8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
      9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
      10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"] },
  
    RdBu: {
      3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
      4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
      5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
      6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
      7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
      8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
      9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
      10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
      11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"] } };

//Fetching data form data.json      
d3.json("data.json", callback);

function callback(error, data) {
  console.log("Callback fn works!");
  if (!error) {
    data.monthlyVariance.forEach((val) => (val.month -= 1));

    //Section as container for every element

    let section = d3.select("body").append("section");

    //Heading for the Map

    let heading = section
      .append("h1")
      .attr("id", "title")
      .text("Monthly Global Land-Surface Temperature");
    heading
      .append("h5")
      .attr("id", "description")
      .html(
        `${data.monthlyVariance[0].year}-${
          data.monthlyVariance[data.monthlyVariance.length - 1].year}:
           base temperature ${data.baseTemperature} &#8451;`                    
      );

      section.append('footer')
      .append('p')
      .html('Made with 💙 by KR.Tirtho | copyright&COPY; 2019-2020')

      //All sizing related 
      let fontSize = 16
      let width = 5 * Math.ceil(data.monthlyVariance.length/12)
      let height = 33 * 12
      var padding = {left: 9* fontSize, right: 9 * fontSize, top:1 * fontSize, bottom: 8 * fontSize}

      //All tooltip cell
      var tip = d3.tip()
                   .attr('class', 'd3-tip')
                   .attr('id', 'tooltip')
                   .html(d=>d)
                   .direction('n')
                   .offset([-10, 0])


    var svg = section.append('svg')
                      .attr({
                          width: width + padding.left + padding.right,
                          height: height + padding.top + padding.bottom
                      })
                      .call(tip)

        //yScale
    var yScale = d3.scale.ordinal()
                           .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])//Months as domain for yAxis
                           .rangeRoundBands([0, height], 0, 0);

    //yAxis                       
    var yAxis = d3.svg.axis().scale(yScale).tickValues(yScale.domain())
                                          .tickFormat(month=>{
                                              var date = new Date(0)
                                              date.setUTCMonth(month);
                                              return d3.time.format.utc("%B")(date);
                                          })
                                          .orient('left')
                                          .tickSize(10, 1)
    
    //Calling the yAxis
    svg.append('g')
        .classed('y-axis', true)//Just setting the className old way
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)  //Giving some padding for the Axis text                                     
        .call(yAxis)
        .append('text')
        .text('Months')
        .style('text-anchor', 'middle')
        .attr('transform', `translate(${-7*fontSize}, ${height/2}) rotate(-90)`)//centering the text vertically  

    //X Scale
    var xScale = d3.scale
                    .ordinal()
                    .domain(data.monthlyVariance.map(val=> val.year))
                    .rangeRoundBands([0, width], 0, 0);

    //xAxis
    
    var xAxis = d3.svg
                   .axis()
                   .scale(xScale)
                   .tickValues(
                       xScale.domain().filter(year=>year % 10 ===0)
                   )
                   .tickFormat(year=>{
                       var date = new Date(0)
                       date.setUTCFullYear(year)
                       return d3.time.format.utc("%Y")(date)
                   })
                   .orient('bottom')
                   .tickSize(10, 1);//Height:Width Ratio💥


        svg.append('g')
            .attr('class', 'x-axis')
            .attr('id', 'x-axis')
            .attr('transform', `translate(${padding.left}, ${height + padding.top})`)
            .call(xAxis)
            .append('text')
            .text('Years')
            .style('text-anchor', 'middle')
            .attr('transform', `translate(${width / 2}, ${3 * fontSize})`)//centering the text horizontally                  

        //legend Starts
         let legendColors = colorbrewer.RdYlBu[11].reverse()
         let legendWidth = 400
         let legendHeight = 300/ legendColors.length //Creates 11 color pallet for each color shade.🟥🟧🟨🟩🟦🟪
          
         let variance = data.monthlyVariance.map(val=>val.variance)

         let minTemp = data.baseTemperature + Math.min.apply(null, variance) //old way of getting the max & min value
         let maxTemp = data.baseTemperature + Math.max.apply(null, variance) //The new way is d3.max()/d3.min()
         
         var legendThreshold = d3.scale.threshold()
                                        .domain(((min, max, count)=>{
                                            let array = []
                                            var step = (max-min) / count
                                            let base = min
                                            for(let i = 1; i < count; i++){
                                                array.push(base + i * step)
                                            }
                                            return array
                                        })(minTemp, maxTemp, legendColors.length))
                                        .range(legendColors);

            let legendX = d3.scale.linear()
                                   .domain([minTemp, maxTemp])
                                   .range([0, legendWidth])
           let legendXAxis= d3.svg.axis()
                                .scale(legendX)
                                .orient('bottom')
                                .tickSize(10, 0)
                                .tickValues(legendThreshold.domain())
                                .tickFormat(d3.format('.1f'));
            let  legend = svg.append('g')
                                .attr('class', 'legend')
                                .attr('id', 'legend')
                                .attr('transform', `translate(${padding.left}, ${padding.top + height + padding.bottom -2 * legendHeight})`)
                                
            legend.append('g')
                    .selectAll('rect')
                    .data(legendThreshold.range().map(color=>{
                        let d = legendThreshold.invertExtent(color);//inverting legendColor[11] to legendColor[0]
                        if(d[0]==null) d[0] = legendX.domain()[0]
                        if(d[1]==null) d[1] = legendX.domain()[1]
                        return d;
                    }))
                    .enter()
                    .append('rect')
                    .style('fill', d=>legendThreshold(d[0]))
                    .attr({
                        x: d=> legendX(d[0]),
                        y: 0,
                        width: d=>legendX(d[1]) - legendX(d[0]),
                        height: legendHeight
                    })

        //calling the legendAxis & appending to  'g' element
        legend.append('g')
                .attr('transform', `translate(${0}, ${legendHeight})`)
                .call(legendXAxis)            
        //Ends✅

        //data Visualization starts here
        svg.append('g')
            .attr('class', 'map')
            .attr('transform', `translate(${padding.left}, ${padding.top})`)
            .selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            //Useless Attributes
            .attr('data-month', d=>d.month)
            .attr('data-year', d=>d.year)
            .attr('data-temp', d=>data.baseTemperature + d.variance)
            //Positioning
            .attr({
                x: d=>xScale(d.year),
                y: d=> yScale(d.month),
                width: d=>xScale.rangeBand(d.year),
                height: d=>yScale.rangeBand(d.month)
            })
            .attr('fill', d=> legendThreshold(data.baseTemperature + d.variance))//Color Should be changing
            //Events
            .on('mouseover', d=>{
                var date = new Date(d.year, d.month)
                var tipStr = `
                              <span class='date'>${d3.time.format('%Y - %B')(date)}</span>
                              <br/>
                              <span class='temperature'>${d3.format('.1f')(data.baseTemperature + d.variance)}&#8451;</span>
                              <br/>
                              <span class='variance'>${d3.format('+.1f')(d.variance)}&#8451;</span>
                             `;
                    tip.attr('data-year', d.year)
                    tip.show(tipStr);            
            })
            .on('mouseout', tip.hide) 
  } else {
    console.error("error loading data from server");
  }
}