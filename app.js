console.log("CONECTADO");

const cards = document.getElementById("card-dinamicas");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();

const pageLinks = document.querySelectorAll(".page-item");
const pagBotones = document.querySelectorAll('button.page-link');

const btnMore = document.getElementById('btnMore');
let pageNumber=1;

document.addEventListener("DOMContentLoaded", (e) => {
    
    fetchData(1, true);
    
});

const paginacion = (e) => {
    //e.preventDefault();

    let activa;
    
    pageLinks.forEach((li, index) => {
        if(li.classList.contains('active')){
            li.classList.remove('active');
            activa = index;
        };
    });

    pageLinks.forEach((li, index) => {
        if(li.textContent.trim() === e.target.textContent){
            if(index === 1 || index === 2 || index === 3){
                li.classList.add('active');
                activa = index;
                pageNumber=li.textContent;
            
            }else if(index === 4){
                if(activa<3){
                    activa ++;
                    pageLinks[activa].classList.add('active');
                    pageNumber = pageLinks[activa].textContent;
                
                }else if(activa === 3){
                    activa = 3;
                    pageLinks[activa].classList.add('active');
                    document.getElementById('a1').textContent++;
                    document.getElementById('a2').textContent++;
                    document.getElementById('a3').textContent++;
                    pageNumber= pageLinks[activa].textContent;
                };
            }else if(index === 0){
                if(activa>1){
                    activa --;
                    pageLinks[activa].classList.add('active');
                    pageNumber = pageLinks[activa].textContent;
                }else if(activa === 1){
                    activa = 1;
                    pageLinks[activa].classList.add('active');
                    document.getElementById('a1').textContent--;
                    document.getElementById('a2').textContent--;
                    document.getElementById('a3').textContent--;
                    pageNumber= pageLinks[activa].textContent;
                };
            };
            
            if(pageLinks[activa].textContent.trim() == 1){
                pageLinks[0].classList.add('disabled');
            }else{
                pageLinks[0].classList.remove('disabled');
            }
            fetchData(pageNumber, true);
        };
    });
}

const fetchData = async (page, clean) => {
    if(clean) cards.textContent = "";

    try {
        loadingData(true);

        const url = `https://rickandmortyapi.com/api/character?page=${page}`;
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
    //console.log(data);
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

pagBotones.forEach((btn) => btn.addEventListener("click",paginacion));

btnMore.addEventListener("click", () => {
    pageNumber++
    fetchData(pageNumber, false);
});

document.getElementById("btnInicio").addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  