import React, { Component } from 'react';
import { isEmpty } from '../helper';
import { baseUrl } from '../config/index.js';
// Data imports
import items from '../resource/item.json';
import champions from '../resource/champion.json';
import runes from '../resource/runesReforged.json';
import summoners from '../resource/summoner.json';

class matchStats extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getDurationTime = (seconds) => {
    const hr = Math.floor(seconds / 3600);
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return hr > 0 ? `${hr} hrs ${minute} min ${second} sec` : `${minute} min ${second} sec`
  }

  getChampionInfo = championId => {
    const championDetail = champions.data;
    let championInfo = {
      name: '',
      id: ''
    }
    for(let i in championDetail) {
      if (parseInt(championDetail[i].key) === championId) {
        championInfo.name = championDetail[i].name;
        championInfo.id = championDetail[i].id;
      }
    }
    return championInfo;
  }

  getSpellName = (spell1Id, spell2Id) => {
    let summonerSpellNames = [];
    for(let name in summoners.data) {
      if(parseInt(summoners.data[name].key) === spell1Id || parseInt(summoners.data[name].key) === spell2Id) {
          summonerSpellNames.push(summoners.data[name].name);
      }
    }
    return summonerSpellNames;
  }

  getRunes = (perkPrimaryStyle, perkSubStyle) => {
    return runes.filter(x => x.id === perkPrimaryStyle || x.id === perkSubStyle).map(x => x.name);
  }

  displayDetail = () => {
    const { data } = this.props;
    if (isEmpty(data)) {
      return;
    }
    const { participantIdentities, participants } = data;
    const summonerId = participantIdentities.find(x => x.player.summonerName.toLowerCase().replace(/ /g,'') === this.props.summoner.toLowerCase().replace(/ /g,'')).participantId;
    // Retrieve correct summoner name format
    const summonerName = participantIdentities.find(x => x.player.summonerName.toLowerCase().replace(/ /g,'') === this.props.summoner.toLowerCase().replace(/ /g,'')).player.summonerName;
    const { stats: matchStats } = participants.find(x => x.participantId === summonerId);
    const matchDetail = participants.find(x => x.participantId === summonerId);

    const { gameDuration } = data;
    
    // Detailed stats of each player
    const {
      totalMinionsKilled,
      neutralMinionsKilled,
      kills,
      deaths,
      assists,
      champLevel,
      perkPrimaryStyle,
      perkSubStyle,
      win
    } = matchStats;

    // Data for each player
    const {
      spell1Id,
      spell2Id,
      championId
    } = matchDetail;

    const time = this.getDurationTime(gameDuration);
    const championInfo = this.getChampionInfo(championId);
    const spellNames = this.getSpellName(spell1Id, spell2Id);
    const runes = this.getRunes(perkPrimaryStyle, perkSubStyle)

    const minute = Math.floor(gameDuration / 60);
    const second = gameDuration % 60;

    let itemName = [];
    for(let i = 0; i <= 6; i++) {
        let itemN = `item${i}`;
        // Not all players have 7 items..
        if (matchStats[itemN]) {
          matchStats[itemN] === 0 ? itemName.push('') : itemName.push(items.data[matchStats[itemN]].name)
        } else {
          continue;
        }
    }
    
    const totalCreepsKilled = totalMinionsKilled + neutralMinionsKilled;
    const creepsKilledPerMin = (totalCreepsKilled / (minute + (second / 60))).toFixed(1)

    const champImage = `${baseUrl}/images/champion/${championInfo.id}.png`;

    const bgColor = win ? '#A2D0EC' : '#E2B5B3';
    return (
      <div style={{ backgroundColor: bgColor}} className="container">
        <div id="column">
          Summoner: {summonerName}
          <br/>
          <br/>
          <b>{win ? 'Victory' : 'Defeat'}</b>
          <br/>
          <br/>
          Game Duration: {time}
        </div>

        <div id="column">
          <img src={(champImage)} alt="" width="60px"/>
          <br/>
          Champion: <b>{championInfo.name}</b>
          <br/>
          <div>Runes:&nbsp;
          {runes.map((rune, index) => {
            return (
                <span key={index}>
                  <img src={(`${baseUrl}/images/rune/${rune}.png`)} alt=""/>
                  {rune}
                </span>
            )}
          )}
          </div>
          <br/>
          <div> Spells: &nbsp;
            {spellNames.join(', ')}
          </div>
        </div>

        <div id="column">
          <div>Items: 
            <ul>
            {itemName.map((x, index) => {
              return (
                <li key={index}> {x} </li>
              )
            })
          }
            </ul>
          </div>


        </div>

        <div id='column'>
          {`${kills}`} / <span style={{color: "crimson", fontWeight: "bold"}}>{`${deaths}`}</span> / {`${assists}`}
          <br/>
          K / D / A 
        </div>

        <div id="column">
          Champion Level: {champLevel}
          <br/>
          Total Minions Kills: {totalCreepsKilled}
          <br/>
          Minions killed per min: {creepsKilledPerMin}
        </div>
        
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.displayDetail()}
      </div>
    )
  }
}

export default matchStats;