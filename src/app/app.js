import React from 'react';
import ReactDOM from 'react-dom'; 
require("./main.less");
require("css!unsemantic/assets/stylesheets/unsemantic-grid-desktop.css");
 
class SimpleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items : [],
            theringer : [],
            bleachreport : [],
            hackernews : [],
            github : [],
            visir : [],
            rss : [],
            cpu : [],
            date: new Date()
        };
    }    

    componentDidMount(){
        setInterval(() => this.setState({date : new Date()}), 1000);
        // this.socket = io.connect('http://localhost:3001', {
        //     'max reconnection attempts': Infinity
        // });
        // bindEvents(this.socket);
    }

    componentWillUnmount(){
        this.socket.disconnect();
    }

    bindEvents(socket) {
        socket.on('connect', function () {
            console.log('connected');
            // init();
        });
        socket.on('reconnect', function () {
            console.log('reconnected');
        });
        socket.on('reconnect_failed', function () {
            console.log('reconnect FAILED!!!');
        });
        socket.on('twitter', function (data) {
            setState((prevState) => {
                prevState.items.unshift(data);
                prevState.items.splice(5);
                return {
                    items: prevState.items
                }
            });
            // $scope.$apply(function () {
            //     $scope.items.unshift(data);
            //     $scope.items.splice(5);
            // });
        });
        socket.on('cpu_percent', function (data) {
            // $scope.$apply(function () {
            //     $scope.cpu = data;
            // });
        });
        socket.on('rss', function (data) {
            // $scope.$apply(function () {
            //     data.media = data['media:thumbnail'];
            //     $scope.rss.unshift(data);
            //     $scope.rss.splice(5);
            // });
        });
        socket.on('hackernews', function (data) {
            // $scope.$apply(function () {
            //     $scope.hackernews.unshift(data);
            //     $scope.hackernews.splice(5);
            // });
        });
        socket.on('reddit.compsci', function (data) {
            // $scope.$apply(function () {
            //     $scope.visir.unshift(data);
            //     $scope.visir.splice(5);
            // });
        });
        socket.on('theringer', function (data) {
            // $scope.$apply(function () {
            //     $scope.theringer.unshift(data);
            //     $scope.theringer.splice(5);
            // });
        });
        socket.on('bleachreport', function (data) {
            // $scope.$apply(function () {
            //     $scope.bleachreport.unshift(data);
            //     $scope.bleachreport.splice(5);
            // });
        });
        socket.on('github', function (data) {
            // $scope.$apply(function () {
            //     var item = data;
            //     if (item.mediathumbnail && item.mediathumbnail.url) item.mediathumbnail.url = item.mediathumbnail.url.replace(/s=30$/, 's=88');
            //     $scope.github.unshift(data);
            //     $scope.github.splice(5);
            // });
        });
        socket.on('disconnect', function () {
            console.log('disconnected');
        });
        bindEvents(socket);
    }

    render() {
        return (
            <div className="grid-container top">
                <div className="grid-25 row">
                        <h4>Twitter</h4>
                </div>
                <div className="grid-50 clock-container row">
                    <div className="clock">{this.state.date.getHours()}<span className="separator">:</span>{this.state.date.getMinutes()}</div>
                </div>
                <div className="grid-25 row">
                        <h4>Reddit</h4>
                </div>
                <div className="grid-25 row">
                        <h4>GitHub</h4>
                </div>
                <div className="grid-25 row">
                        <h4>Bleach report</h4>
                </div>
                <div className="grid-25 row">
                        <h4>The Ringer</h4>
                </div>
                <div className="grid-25 row">
                        <h4>HackerNews</h4>
                </div>
            </div>
        );
    } 
};
 
ReactDOM.render(
    <SimpleComponent message="React Demo" />,
    document.querySelector( '.js-app' )
);