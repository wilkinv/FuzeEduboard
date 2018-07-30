import React, { Component } from 'react';

class Notes extends Component {

    constructor(props) {
        super(props);

        this.username = this.props.username;
        this.databaseNotes = this.props.database.ref().child('notes');
        this.changeCurrent = this.changeCurrent.bind(this);
        this.deleteMsg = this.deleteMsg.bind(this);


        this.state = {
            notes: [],
            keys: [],
        }
    }

    componentWillMount() {
        const {changeCurrent} = this;
        this.databaseNotes.on('child_added', snapshot => {
            const response = snapshot.val();
            const key = snapshot.key;
            if (response.usersaver === this.username) {
                changeCurrent(response, key);
            }
        });
    }

    changeCurrent(response, key) {
        const notes = this.state.notes;
        const keys = this.state.keys;
        const arrayResponse = response.noteBody;
        const username = response.username;

        let combo = {};
        combo.noteBody = arrayResponse;
        combo.username = username;

        notes.push(combo);
        keys.push(key);

        this.setState({
            notes: notes,
            keys: keys,
        })
    }

    deleteMsg(event) {
        const tag = event.currentTarget.dataset.tag;
        const key = this.state.keys[tag];
        const notes = this.state.notes;
        const keys = this.state.keys;
        notes.splice(tag, 1);
        keys.splice(tag, 1);
        this.databaseNotes.child(key).remove();
        this.setState({
            notes: notes,
            keys: keys,
        })
    }

    render() {
        return (
            <div>
                <h3 align="center">Saved Notes</h3>
                {this.state.notes.map((noteBody, idx) => {
                    return (
                        <div>
                            <div>
                                <div className="card bg-info msg-body">
                                    <div className="card-body">
                                        <div>{noteBody.noteBody}</div>
                                        <br />
                                        <button className="button" data-tag={idx} onClick={this.deleteMsg}>Delete</button>
                                    </div>
                                    <div className="card-footer">
                                        <div>By: {noteBody.username}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
            </div>
        );
    }

}

export default Notes;