import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import './Eyes.css';
import {unsubscribeIfCan} from "../tools/rxTools";
import {ACTION_LEFT, ACTION_RIGHT} from "../tools/EyeActions";
import {hot} from "react-hot-loader";
import React from 'react';


const STATE = 'state';

/**
 * has in parameters windowSize and eyeAction
 */
class Eyes extends React.Component {
    stateSub = new Subject();
    resultDebounce = this.stateSub.pipe(debounceTime(300));
    subscription;
    exerciseSubscription;
    constructor(props) {
        super(props);
        this.state = {windowSize: props.windowSize, eyeAction: ''};
        this.subscription = this.resultDebounce.subscribe(state => {
            if (state.action === STATE){
                this.setState(state.data)
            }
        })
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (JSON.stringify(prevState) !== JSON.stringify(this.props)) {
            this.stateSub.next({action: STATE, data: this.props })
        }
    }

    componentWillUnmount() {
        unsubscribeIfCan(this.subscription);
        unsubscribeIfCan(this.exerciseSubscription);
    }

    render() {
        let eyeSize = this.state.windowSize.width > this.state.windowSize.height ? this.state.windowSize.height : this.state.windowSize.width;
        let classNameEyeMove = "";
        if (this.state.eyeAction && this.state.eyeAction === ACTION_LEFT) {
            classNameEyeMove += ' moveLeft'
        } else if (this.state.eyeAction && this.state.eyeAction === ACTION_RIGHT) {
            classNameEyeMove += ' moveRight'
        }

        return (
            <div className="container" style={{width: eyeSize, height: eyeSize}}>
                <div className={classNameEyeMove + " eye eyeLeft"}/>
                <div className={classNameEyeMove + " eye eyeRight"}/>
            </div>)
    };
}

export default hot(module)(Eyes);