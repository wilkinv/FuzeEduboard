import React, { Component } from 'react';
import { Element } from 'react-faux-dom';
import * as d3 from 'd3';

class Stats extends Component {

    constructor(props) {
        super(props);

        this.databaseRef = this.props.database.ref().child('post');
        this.changeCurrent = this.changeCurrent.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.wordsHashmap = {};
        this.numposts = 0;

        this.state = {
            words: [],
            filterList: '',
        }
    }

    componentWillMount() {
        const {changeCurrent} = this;
        this.databaseRef.on('child_added', snapshot => {
            const response = snapshot.val();
            changeCurrent(response);
        });
    }

    changeCurrent(response) {
        let post = response.postBody;
        post = post.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
        let words = post.split(" ");

        for (let i = 0; i < words.length; i++) {
            if (words[i] in this.wordsHashmap) {
                this.wordsHashmap[words[i]] = this.wordsHashmap[words[i]] + 1;
            } else {
                this.wordsHashmap[words[i]] = 1;
            }
        }

        this.numposts = this.numposts + 1;

        this.setState({
            words: words,
        })
    }

    handleChangeText(ev) {
        this.setState({
            filterList: ev.target.value
        })
    }

    plot(chart, width, height) {

        const data = [];

        let filters = this.state.filterList.split(",");
        let filtersHash = {};

        for (let i = 0; i < filters.length; i++) {
            filtersHash[filters[i]] = 1;
        }

        for(let key in this.wordsHashmap){
            if (key in filtersHash) {
                data.push({word: key, frequency: this.wordsHashmap[key]});
            }
        }

        // create scales!
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.word))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)])
            .range([height, 0]);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d.word))
            .attr('y', d => yScale(d.frequency))
            .attr('height', d => (height - yScale(d.frequency)))
            .attr('width', d => xScale.bandwidth())
            .style('fill', (d, i) => colorScale(i));



        const xAxis = d3.axisBottom()
            .scale(xScale);

        chart.append('g')
            .classed('x axis', true)
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        const yAxis = d3.axisLeft()
            .ticks(5)
            .scale(yScale);

        chart.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);

        chart.select('.x.axis')
            .append('text')
            .attr('x',  width/2)
            .attr('y', 60)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Topics');

        chart.select('.y.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(-50, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')
            .text('Count');

        const yGridlines = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickSize(-width,0,0)
            .tickFormat('');

        chart.append('g')
            .call(yGridlines)
            .classed('gridline', true);
    }

    drawChart() {
        const width = 800;
        const height = 450;

        const el = new Element('div');
        const svg = d3.select(el)
            .append('svg')
            .attr('id', 'chart')
            .attr('width', width)
            .attr('height', height);

        const margin = {
            top: 60,
            bottom: 100,
            left: 80,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        this.plot(chart, chartWidth, chartHeight);

        return el.toReact();
    }

    render() {
        let chart = this.drawChart();
        return (
          <div>
              <h3 align="center">Patterns and Participation Trends</h3>
              {chart}
              <h3>Total Main Posts: {this.numposts}</h3>
              <div className="msg-poster">
                  <h3>Enter topics in text box below to see most frequently discussed! (Separate by comma without spaces)</h3>
                  <br />
                  <textarea className="form-control" value={this.state.filterList} onChange={this.handleChangeText}/>
              </div>
          </div>
        );
    }

}

export default Stats;