(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        const clientID = '7afe00c1ebac8d0be88db8d4b87799981e0745f0a98a64dda045b6033c228837';
        /*unsplash api*/
        fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}&client_id=${clientID}`
        ).then(response => response.json())
        .then(addImage)
        .catch(e => requestError(e, 'image'));
        /*NY times API*/
        fetch(
            `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=f0f33f3526344777b33ab2d7eaf68fbe`
        ).then(response => response.json())
        .then(addArticles)
        .catch(e => requestError(e, 'article'));
    });
})();

function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
}

function addImage(images) {
    const firstImage = images.results[0];
    let responseContainer = document.querySelector('#response-container');
    let htmlContent='';
    if (firstImage){
        htmlContent= `<figure>
            <img src="${firstImage.urls.small}" alt="${firstImage.description}">
            <figcaption>Photo by ${firstImage.user.name}</figcaption>
        </figure>`;
    }
    else {
        htmlContent = 'Unfortunately, no image was returned for your search.'
    }
    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}


function addArticles(articles) {
    const responseContainer = document.querySelector('#response-container');
    let data = articles.response;
    let ul = document.createElement('ul');
    for (let item of data.docs) {
        ul.innerHTML += `<li class="article"><h2><a href="${item.web_url}">${item.headline.main}</a></h2><p>${item.snippet}<p></li>`;
    }
    responseContainer.appendChild(ul);
    if (data.docs.length=0){
        responseContainer.insertAdjacentHTML('afterbegin', '<p>Unfortunately, no article was returned for your search.</p>');
    }
}
