import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {

    const{loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=db8b7934e02a18617f3c826ad0fdf449';
    const _baseOffset = 210;


    const getAllCharacters = async (num, offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=${num}&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (num, offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=${num}&offset=${offset}&issueNumber=1&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0,210)}...` : 'No description found',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            image: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'NOT AVAILABLE',
            url: comic.urls[0].url,
            description: comic.description || "There is no description",
			pageCount: comic.pageCount ? `${comic.pageCount} pages` : "No information about the number of pages",
            language: comic.textObjects[0]?.language || "en-us",
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName};
}

export default useMarvelService;