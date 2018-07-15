import React, { Component } from 'react';

class Innerposts extends Component {

    constructor(props) {
        super(props);

        let curPost = 'post';

        let randnum = Math.floor(Math.random() * Math.floor(3)) + 1;

        curPost = curPost + randnum;

        this.databaseRef = this.props.database.ref().child(curPost);
        this.databaseNotes = this.props.database.ref().child('notes');
        this.newMsg = this.newMsg.bind(this);
        this.changeCurrent = this.changeCurrent.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.deleteMsg = this.deleteMsg.bind(this);
        this.randnum = randnum;


        this.state = {
            posts: [],
            keys: [],
            newPostBody: '',
        }
    }

    componentWillMount() {
        const {changeCurrent} = this;
        this.databaseRef.on('child_added', snapshot => {
            const response = snapshot.val();
            const key = snapshot.key;
            changeCurrent(response, key);
        });
    }

    handleChangeText(ev) {
        this.setState({
            newPostBody: ev.target.value
        })
    }

    newMsg() {
        const postBody = this.state.newPostBody;
        const postToSave = {postBody};
        this.databaseRef.push().set(postToSave);
        this.setState({
            newPostBody: '',
        });
    }

    changeCurrent(response, key) {
        const posts = this.state.posts;
        const keys = this.state.keys;
        const arrayResponse = response.postBody;
        posts.push(arrayResponse);
        keys.push(key);
        posts.map(post => ({post, ref: React.createRef() }));
        this.setState({
            posts: posts,
            keys: keys,
        })
    }

    saveNote(event) {
        const tag = event.currentTarget.dataset.tag;
        const noteBody = this.state.posts[tag];
        const noteToSave = {noteBody};
        this.databaseNotes.push().set(noteToSave);
    }

    deleteMsg(event) {
        const tag = event.currentTarget.dataset.tag;
        const key = this.state.keys[tag];
        this.databaseRef.child(key).remove();
        window.location.reload();
    }

    render() {
        return (
            <div>
                <h3 align="center">You are in Group {this.randnum}</h3>
                {this.state.posts.map((postBody, idx) => {
                    return (
                        <div>
                            <div>
                                <div className="card bg-secondary msg-body">
                                    <div className="card-body msg-inner">
                                        <div>{postBody}</div>
                                        <br />
                                        <button className="button" data-tag={idx} onClick={this.saveNote}>Save</button>
                                        <button className="button" data-tag={idx} onClick={this.deleteMsg}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
                }
                <div className="card msg-poster">
                    <div className="card-body msg-inner">
                        <textarea className="form-control" value={this.state.newPostBody} onChange={this.handleChangeText}/>
                        <button className="btn btn-success msg-button" onClick={this.newMsg}>Send</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Innerposts;