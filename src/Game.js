import React, { Component } from 'react';
import InfoDisplay from './InfoDisplay';
import UpgradePanel from './UpgradePanel';

class Game extends Component {

    LOOTER_TYPES = [
        {
            id: 0,
            name: "Lame looter",
            cost: 30,
            lootPerSecond: 1,
        },
        {
            id: 1,
            name: "Rookie looter",
            cost: 100,
            lootPerSecond: 4,
        },
        {
            id: 2,
            name: "Intermediate looter",
            cost: 250,
            lootPerSecond: 12,
        },
    ];

    DEFENDER_TYPES = [
        {
            id: 0,
            name: "Defenseless child",
            cost: 20,
            strength: 1,
        },
        {
            id: 1,
            name: "Jeff",
            cost: 50,
            strength: 3,
        },
        {
            id: 2,
            name: "Sir Cancelot",
            cost: 100,
            strength: 8,
        },
        {
            id: 3,
            name: "Big boi",
            cost: 250,
            strength: 25,
        },
    ]

    constructor(props) {
        super(props);
        this.state = {
            loot: 30,
            wave: {
                number: 0,
                secondsUntil: 60,
                strength: 5,
            },
            secondsBetweenWaves: 60,
            lootPerSecond: 1.0,
            strength: 0.0,
        };

        this.updateGame = this.updateGame.bind(this);
        this.upgradeHandler = this.upgradeHandler.bind(this);
    }
    
    upgradeHandler(e) {
        // Make sure we don't follow the link
        e.preventDefault();
        
        // Extract key information from target
        const target = e.currentTarget;
        const type = target.getAttribute('type');
        const id = target.getAttribute('id');
        
        // Decide on the type of the upgrade
        let definition;
        if (type === 'looter') {
            definition = this.LOOTER_TYPES[id];
        } else if (type === 'defender') {
            definition = this.DEFENDER_TYPES[id];
        } else {
            throw new TypeError("You can only upgrade looters & defenders.");
        }
        
        // Can afford it, so buy it
        if (this.state.loot >= definition['cost']) {
            // Subtract loot used for purchase
            const newState = {...this.state}
            newState['loot'] -= definition['cost'];
            // At this point, we've checked it's either looter or defender
            if (type === 'looter') {
                // Subtract loot and add lootPerSecond
                newState['lootPerSecond'] += definition['lootPerSecond'];
            } else {
                newState['strength'] += definition['strength'];
            }
            this.setState(newState)
        } else {
            alert("No! You can't! Not enough moneyz!")
        }
    }

    getNextWaveStrength() {
        return this.state.wave.strength * 3;
    }

    isGameOver() {
        return this.state.strength < 0;
    }
    
    updateGame() {
        // Game over?
        if (this.isGameOver()) {
            clearInterval(this.gameUpdater);
            alert("gid gud scrub");
        }

        // Update the amount of loot we have
        this.setState({
            loot: this.state.loot + this.state.lootPerSecond,
            wave: { ...this.state.wave,
                secondsUntil: this.state.wave.secondsUntil - 1,
            },
        });

        // Wave has arrived
        if (this.state.wave.secondsUntil <= 0) {
            // handle wave
            console.log("Wave has arrived")
            this.setState({
                strength: this.state.strength - this.state.wave.strength,
            })

            // if we survived
            this.setState({
                wave: { ...this.state.wave,
                    number: this.state.wave.number + 1,
                    secondsUntil: this.state.secondsBetweenWaves,
                    strength: this.getNextWaveStrength()
                },
            });
        }
    }

    componentDidMount() {
        this.gameUpdater = setInterval(this.updateGame, 1000);
    }
    
    render() {
        return (
            <div className="container">
                <InfoDisplay    state={this.state}
                                looters={this.LOOTER_TYPES} />
                <UpgradePanel loot={this.state.loot}
                            looters={this.LOOTER_TYPES}
                            defenders={this.DEFENDER_TYPES}
                            upgradeHandler={this.upgradeHandler} />
            </div>
        )
    }

}

export default Game;