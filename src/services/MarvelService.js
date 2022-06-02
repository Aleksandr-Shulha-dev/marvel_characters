import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();
  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=459d793f730fc7cef10a187346109f70';
  const _baseOffset = 610;

  

  const getAllCharacters = async(offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  }

  const getAllComics = async(offset = _baseOffset) => {
    const res = await request(`${_apiBase}/comics?issueNumber=1&limit=12&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComic)
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? char.description.slice(0, 210) + '...': 'Description not found',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  const _transformComic = (char) => {
    return {
      id: char.id,
      title: char.title,
      description: char.description ? char.description.slice(0, 210) + '...': 'Description not found',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      price: char.prices[0].price,
    }
  }

  

  return{loading, error,  getAllCharacters, getCharacter, getAllComics, clearError}
}

export default useMarvelService