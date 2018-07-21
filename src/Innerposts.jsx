import React, { Component } from 'react';

class Innerposts extends Component {

    constructor(props) {
        super(props);

        let curPost = 'post';

        let randnum = Math.floor(Math.random() * Math.floor(3)) + 1;

        curPost = curPost + randnum;

        this.username = this.props.username;
        this.databaseRef = this.props.database.ref().child(curPost);
        this.databaseNotes = this.props.database.ref().child('notes');
        this.newMsg = this.newMsg.bind(this);
        this.changeCurrent = this.changeCurrent.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.saveNote = this.saveNote.bind(this);
        this.deleteMsg = this.deleteMsg.bind(this);
        this.checkAbleDelete = this.checkAbleDelete.bind(this);
        this.randnum = randnum;


        this.state = {
            posts: [],
            keys: [],
            ids: [],
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
        const username = this.username;
        const postBody = this.state.newPostBody;
        const idNum = new Date().getTime();
        const postToSave = {postBody, idNum, username};
        this.databaseRef.push().set(postToSave);
        this.setState({
            newPostBody: '',
        });
    }

    changeCurrent(response, key) {
        const posts = this.state.posts;
        const ids = this.state.ids;
        const keys = this.state.keys;
        const arrayResponse = response.postBody;
        const id = response.idNum;
        const username = response.username;

        let combo = {};
        combo.postBody = arrayResponse;
        combo.username = username;

        posts.push(combo);
        keys.push(key);
        ids.push(id);
        this.setState({
            posts: posts,
            keys: keys,
            ids: ids,
        })
    }

    saveNote(event) {
        const tag = event.currentTarget.dataset.tag;
        const noteBody = this.state.posts[tag].postBody;
        const username = this.state.posts[tag].username;
        const idNum = this.state.ids[tag];
        const noteToSave = {noteBody, idNum, username};
        this.databaseNotes.orderByChild("idNum").equalTo(idNum).once("value",snapshot => {
            const userData = snapshot.val();
            if (!userData){
                this.databaseNotes.push().set(noteToSave);
            }
        });
    }

    deleteMsg(event) {
        const tag = event.currentTarget.dataset.tag;
        const key = this.state.keys[tag];
        const username = this.state.posts[tag].username;
        const posts = this.state.posts;
        const keys = this.state.keys;
        const ids = this.state.ids;
        if (this.username === username) {
            posts.splice(tag, 1);
            keys.splice(tag, 1);
            ids.splice(tag, 1);
            this.databaseRef.child(key).remove();
            this.setState({
                posts: posts,
                keys: keys,
                ids: ids,
            })
        }
    }

    checkAbleDelete(username) {
        return username === this.username;
    }

    render() {
        return (
            <div>
                <h3 align="center">You are in Group {this.randnum}</h3>
                {this.state.posts.map((postBody, idx) => {
                    if (this.checkAbleDelete(postBody.username))
                        return (
                            <div>
                                <div>
                                    <div className="card bg-secondary msg-body">
                                        <div className="card-body">
                                            <div>{postBody.postBody}</div>
                                            <br />
                                            <button className="button" data-tag={idx} onClick={this.saveNote}>Save</button>
                                            <button className="button" data-tag={idx} onClick={this.deleteMsg}>Delete</button>
                                        </div>
                                        <div className="card-footer">
                                            <div>By: {postBody.username}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    return (
                        <div>
                            <div>
                                <div className="card bg-secondary msg-body">
                                    <div className="card-body">
                                        <div>{postBody.postBody}</div>
                                        <br />
                                        <button className="button" data-tag={idx} onClick={this.saveNote}>Save</button>
                                    </div>
                                    <div className="card-footer">
                                        <div>By: {postBody.username}</div>
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