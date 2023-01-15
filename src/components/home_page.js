import React, {Component} from "react";
import logo from "../assets/img/banksy.svg";
import MydModalWithGrid from "./modal_create_meme";
import Card from "react-bootstrap/Card";
import support from "../assets/img/support.svg";
import 'bootstrap/dist/css/bootstrap.min.css';

const app = document.getElementById('App');

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "HomePage",
            memes: [],
            currentMemeSelected: {
                user_id: null,
                meme_id: null,
                meme_name: '',
                meme_url: null,
                meme_width: null,
                meme_height: null,
                meme_box_count: null,
                meme_captions: null,
                showModalCreateMeme: false,
                urlToGenerateMeme: null,
                urlToRetriveMeme: null,
                commentBoxes: null,
                handleSubmitForm: null,
            },
        };
        //this.createComponents = this.createComponents.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    async handleClickCard(meme_id, meme_name, meme_url, meme_width, meme_height, meme_box_count, meme_captions) {

        // Modification available only i a user is logged
        if (this.props.isUserLogged) {
            let commentBoxes = [];
            for (let i = 0; i < meme_box_count; i++) {
                commentBoxes.push({key: i, value: i});
            }

            this.state.currentMemeSelected.user_id = this.props.user_id;
            this.state.currentMemeSelected.meme_id = meme_id;
            this.state.currentMemeSelected.meme_name = meme_name;
            this.state.currentMemeSelected.meme_url = meme_url;
            this.state.currentMemeSelected.meme_width = meme_width;
            this.state.currentMemeSelected.meme_height = meme_height;
            this.state.currentMemeSelected.meme_box_count = meme_box_count;
            this.state.currentMemeSelected.meme_captions = meme_captions;
            this.state.currentMemeSelected.commentBoxes = commentBoxes;
            this.state.currentMemeSelected.handleSubmitForm = this.handleSubmitForm;
            this.state.currentMemeSelected.showModalCreateMeme = true;
            this.setState({});
        }
    }

    handleModalClose = () => {
        this.setState({
            currentMemeSelected: {
                showModalCreateMeme: false
            }
        });
    };

    handleSubmitForm = async (event) => {
        event.preventDefault();

        let commentBoxes = [];
        let str = "";
        for (let i = 0; i < event.target.length - 1; i++) {
            str += `&boxes[${i}][text]=${event.target.elements[i].value}&boxes[${i}][color]=%23C0C0C0`;

            // Save comments
            commentBoxes.push(event.target.elements[i].value);
        }

        this.state.currentMemeSelected.urlToGenerateMeme = `https://api.imgflip.com/caption_image?username=AurelienVAILLANT&password=nW@:-*9a&template_id=${this.state.currentMemeSelected.meme_id}&font=arial` + str;
        this.state.currentMemeSelected.showModalCreateMeme = false;
        this.state.currentMemeSelected.commentBoxes = commentBoxes;

        this.setState({});

        this.createMemeOnImgflip({
            user_id: this.state.currentMemeSelected.user_id,
            meme_id: this.state.currentMemeSelected.meme_id,
            meme_name: this.state.currentMemeSelected.meme_name,
            meme_url: this.state.currentMemeSelected.meme_url,
            meme_width: this.state.currentMemeSelected.meme_width,
            meme_height: this.state.currentMemeSelected.meme_height,
            meme_box_count: this.state.currentMemeSelected.meme_box_count,
            meme_captions: this.state.currentMemeSelected.meme_captions,
            urlToGenerateMeme: this.state.currentMemeSelected.urlToGenerateMeme,
            commentBoxes: this.state.currentMemeSelected.commentBoxes,
        });
    }

    createMemeOnImgflip(data) {
        fetch('https://meme-project-server-ava.onrender.com/api/memes/createMeme/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                    this.state.currentMemeSelected.urlToRetriveMeme = data['urlToRetriveMeme'];
                    // Refresh memes history
                    this.props.getUserMemesHistory(data['idUser']);

                    // Close the create modal
                    this.handleModalClose();
                }
            ).catch(err => {
                console.error(err);
                const errorMessage = document.createElement('marquee');
                errorMessage.textContent = `Gah, ${err.message} !`;
                app.appendChild(errorMessage);
            }
        );
    }

    render() {
        return (
            <>
                <div className="main-container">
                    <div className="sub-main-container">
                        <div className="top-container">
                            <img id="imgUser" hidden={!this.props.isUserLogged} src={support} alt="support face"></img>
                            <div className="d-flex justify-content-center">
                                <h4>{!this.props.isUserLogged ? 'No user connected !' : 'Connected with ' + this.state.user_name}</h4>
                            </div>
                            <h1 className={"title-page"}>Home</h1>
                        </div>
                        <div className="parent-card">
                            <ul>
                                {this.state.memes ? this.state.memes.map((e, index) => {

                                    return (
                                        <li key={index.toString()}>
                                            <Card className="parent-card">
                                                <Card.Title
                                                    style={{color: 'black'}}><strong>{e.meme_name}</strong></Card.Title>
                                                <Card.Img variant="top" src={e.url.toString()} style={{
                                                    marginTop: 0,
                                                    padding: 0,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 12
                                                }} alt={'image brute'}
                                                          onClick={this.handleClickCard.bind(this, e.id, e.name, e.url, e.width, e.height, e.box_count, e.captions)}/>
                                                <Card.Body>
                                                    <Card.Title
                                                        style={{color: 'black'}}><strong>{e.name}</strong></Card.Title>
                                                    <Card.Subtitle
                                                        className="mb-2 text-muted">{e.width + ' x ' + e.height}
                                                    </Card.Subtitle>
                                                    <Card.Subtitle
                                                        className="mb-2 text-muted">{e.box_count + ' text zones'}
                                                    </Card.Subtitle>
                                                </Card.Body>
                                            </Card>
                                        </li>
                                    );
                                }) : null}
                            </ul>
                        </div>
                        <div className="d-flex justify-content-around">
                            <img src={logo} alt="logo"/>
                        </div>
                    </div>
                </div>
                {this.state.currentMemeSelected.meme_id ?
                    <MydModalWithGrid
                        backdrop="static"
                        keyboard={this.state.currentMemeSelected.showModalCreateMeme}
                        centered
                        size="sm"
                        show={true}
                        onHide={this.handleModalClose}
                        props={this.state.currentMemeSelected}
                    /> : null}
            </>
        );
    }

    // Check if an HTML compnent is empty
    isEmpty(id) {
        return document.getElementById(id).innerHTML.trim() === ""
    }

    componentDidMount() {
        fetch('https://meme-project-server-ava.onrender.com/api/memes/imgflip/')
            .then(response => response.json())
            .then(data => {
                    // Shuffle the result
                    this.memes = data.sort(() => Math.random() - 0.5);
                    // The maximum memes from imgFlip is 100
                    // Here it limited to 50
                    this.memes.length = 50;

                    this.setState({
                        memes: this.memes,
                    });
                }
            )//.then((_) => this.createComponents())
            .catch(err => {
                    console.error(err);
                }
            );
    }
}

export default HomePage;