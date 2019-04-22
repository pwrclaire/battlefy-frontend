import React, { Component } from 'react';
import MatchDetail from './MatchDetail';
import { isEmpty } from '../helper';
import { baseUrl } from '../config';
import regions from '../resource/regions.js';
// Bootstrap ui
import ListGroup from 'react-bootstrap/ListGroup';
import Navbar from 'react-bootstrap/Navbar';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Button from 'react-bootstrap/Button';

 class Home extends Component {
   state = {
     data: '',
     summoner: '',
     loading: false,
     summonerInput: '',
     region: 'na1'
   }

  componentWillMount() {
   this.displayData();
  }

  handleChange = e => {
    this.setState({
      summonerInput: e.target.value
    })
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    })
    if (this.state.summonerInput !== "") {
        const response = await fetch(baseUrl + '/matchDetail', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({summoner: this.state.summonerInput, region: this.state.region})
        }).catch(err => alert(err));
        const data = await response.json();
        if (!isEmpty(data)) {
          await this.setStateAsync({
            data: data,
            summoner: this.state.summonerInput,
            loading: false
          });
        } else {
          this.setState({
            loading: false,
            summonerInput: ''
          })
          alert("No Data Found");
        }
      } else {
        alert("Cannot submit empty Summoner");
        return;
      }
  }

   setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  setRegion = e => {
    this.setState({
      region: e.target.value
    })
  }

  displayData = () => {
    const { data } = this.state;
    if (this.state.loading) {
      return (
        <div>
          <img src={require('../image/load.gif')} alt=""/>
        </div>
      )
    }
    if (!isEmpty(data)) {
      return (
        <ListGroup>{data.map(x => {
          return (
            <ListGroupItem key={x.gameId} >
              <MatchDetail data={x} summoner={this.state.summoner}/>
            </ListGroupItem>
          )
        })}</ListGroup>
      )
    }
  }

  displaySearch = () => {
    return (
      <div>
      <input type="text"
        value={this.state.summonerInput}
        onChange={(e) => {this.handleChange(e)}}
        placeholder="Summoner Name"
        onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.handleSubmit()
                }
              }}
        />&nbsp;
      <select value={this.state.region} onChange={this.setRegion} style={styles.dropdown}>
        {regions.map(region => {
          return (
            <option value={region} key={region}>{region}</option>
          )
        })}
      </select>&nbsp;

        <Button onClick={(e) => this.handleSubmit(e)}>Go!</Button>
      </div>
    )
  }
  
  render() {
    return (
      <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>League of Legend Stats</Navbar.Brand>
      </Navbar>
      <br/>
        {this.displaySearch()}
        {!isEmpty(this.state.data) ? this.displayData() : ""}
      </div>
    )
  }
}

const styles = {
  dropdown: {
    height: '39px'
  }
}

export default Home;