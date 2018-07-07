import React, { Component } from 'react';

class Posts extends Component {

    constructor(props) {
        super(props);

        let curPost = 'post';

        if (props.inner === 1) {
            curPost = 'post1';
        }

        this.databaseRef = this.props.database.ref().child(curPost);
        this.newMsg = this.newMsg.bind(this);
        this.changeCurrent = this.changeCurrent.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);

        this.state = {
            posts: [],
            newPostBody: '',
        }
    }

    componentWillMount() {
        const {changeCurrent} = this;
        this.databaseRef.on('child_added', snapshot => {
            const response = snapshot.val();
            changeCurrent(response);
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

    changeCurrent(response) {
        const posts = this.state.posts;
        const arrayResponse = [response.postBody];
        posts.push(arrayResponse);
        this.setState({
            posts: posts,
        })
    }

    render() {
        return (
            <div>
                {this.state.posts.map((postBody, idx) => {
                    return (
                        <div>
                            <div>
                                <div className="card msg-body">
                                    <div className="card-body msg-inner">
                                        { postBody.map((postPart, idx) => (
                                            <div>{postPart}</div>
                                        )) }
                                    </div>
                                </div>
                            </div>
                            <div className="btn mx-auto d-block">
                                <button>Save</button>
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

export default Posts;