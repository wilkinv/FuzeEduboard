import React, { Component } from 'react';

class Notes extends Component {

    constructor(props) {
        super(props);

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
            changeCurrent(response, key);
        });
    }

    changeCurrent(response, key) {
        const notes = this.state.notes;
        const keys = this.state.keys;
        const arrayResponse = response.noteBody;
        notes.push(arrayResponse);
        keys.push(key);
        notes.map(notes => ({notes, ref: React.createRef() }));
        this.setState({
            notes: notes,
            keys: keys,
        })
    }

    deleteMsg(event) {
        const tag = event.currentTarget.dataset.tag;
        const key = this.state.keys[tag];
        this.databaseNotes.child(key).remove();
        window.location.reload();
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
                                    <div className="card-body msg-inner">
                                        <div>{noteBody}</div>
                                        <br />
                                        <button className="button" data-tag={idx} onClick={this.deleteMsg}>Delete</button>
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