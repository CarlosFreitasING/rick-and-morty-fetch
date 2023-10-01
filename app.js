console.log("CONECTADO");

url = "https://rickandmortyapi.com/api/character?page=1";

const cards = document.getElementById("card-dinamicas");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", () => {

    fetchData();

});

const fetchData = async () => {

    try {
        loadingData(true);

        const res = await fetch(url);
        const data = await res.json();
        
        // Fetch episode data for each character
        const episodes = await Promise.all(
            data.results.map(async (character) => {
                const episodeRes = await fetch(character.episode[0]);
                const episodeData = await episodeRes.json();
                return {
                    //...character,
                    episodeName: episodeData.name
                };
            })
        );
        
        pintarCard(data, episodes);

    } catch (error) {
        console.log(error);
    } finally {
        loadingData(false);
    }

};

const pintarCard = (data, episode) => {
    console.log(data);
    data.results.forEach(item => {
        const clone = templateCard.cloneNode(true);
        clone.querySelector("h5").textContent = item.name;
        clone.getElementById("estadoEspecie").textContent = (item.status === "Alive"? "🟢 ": 
                                                             item.status === "Dead" ? "🔴 ": 
                                                                                      "🔘 ")+ item.status +" - "+ item.species;
        
        
        clone.getElementById("location").textContent = item.location.name;
        
        clone.getElementById("episode").textContent = episode[0].episodeName;
        episode.shift();

        clone.querySelector("img").setAttribute("src", item.image);
        
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

const loadingData = estado => {
    const loading = document.getElementById("loading");
    if(estado){
        loading.classList.remove('d-none');
    }else{
        loading.classList.add('d-none');
    }
};