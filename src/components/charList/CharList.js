import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';


class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 619,
        charEnded: false
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (chars) => {
        let ended = chars.length < 9;

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...chars],
            loading: false,
            error: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    loadMoreChar = (offset) => {
        this.updateChar(offset);
        this.setState(state => ({offset: state.offset + 9}))
    }

    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const {onCharSelected} = this.props;
        const charElements = charList.map((char, ind) => {
            return <Character 
                        char={char} 
                        key={char.id}
                        getCharId={() => onCharSelected(char.id)} 
                    />
        })
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? charElements : null;
        const clazz = loading || error? 'char__grid char__grid--center' : 'char__grid';



        return (
            <div className="char__list">
                <ul className={clazz}>
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none': 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

const Character = ({char, getCharId}) => {
    const {name, thumbnail} = char;
    const imgNotFound = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

    const imgUnset = (thumbnail === imgNotFound) ? {'objectFit' : 'unset'} : null ;

    return (
        <li className="char__item" onClick={getCharId} tabIndex='0'>
            <img src={thumbnail} alt="abyss" style={imgUnset}/>
            <div className="char__name">{name}</div>
        </li>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}
export default CharList;