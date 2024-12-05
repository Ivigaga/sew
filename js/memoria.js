const elements = [
    {
        "element": "RedBull",
        "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
    },
    {
        "element": "RedBull",
        "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
    },
    {
        "element": "McLaren",
        "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
    },
    {
        "element": "McLaren",
        "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
    },
    {
        "element": "Alpine",
        "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
    },
    {
        "element": "Alpine",
        "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
    },
    {
        "element": "AstonMartin",
        "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
    },
    {
        "element": "AstonMartin",
        "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
    },
    {
        "element": "Ferrari",
        "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
    },
    {
        "element": "Ferrari",
        "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
    },
    {
        "element": "Mercedes",
        "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
    },
    {
        "element": "Mercedes",
        "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
    }
]

class Memoria {

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        for (let i = elements.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
    }


    unflipCards(){
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.removeAttribute('data-state');
            this.secondCard.removeAttribute('data-state');
            this.resetBoard();
          }, 1000);
    }

    resetBoard(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch(){
        this.firstCard.getAttribute('data-element')==this.secondCard.getAttribute('data-element') ? this.disableCards(): this.unflipCards();
    }

    disableCards(){
        this.firstCard.setAttribute('data-state', 'revealed');
        this.secondCard.setAttribute('data-state', 'revealed');
        this.resetBoard();
    }

    createElements() {
        var section = document.querySelector("body section");
        for (let i = 0; i < elements.length; i++) {
            var card = document.createElement("article");
            card.setAttribute("data-element", elements[i].element);
            const cardTitle = document.createElement("h3");
            cardTitle.innerText = "Tarjeta de memoria";
    
            const img = document.createElement("img");
            img.setAttribute("src", elements[i].source);  // Usando setAttribute para src
            img.setAttribute("alt", elements[i].element); // Usando setAttribute para alt
            
            card.appendChild(cardTitle);
            card.appendChild(img);
            
            section.appendChild(card);
        }
    }

    
    flipCard(card){
        if(card.getAttribute('data-state')!='revealed' && !this.lockBoard && card!=this.firstCard ){
            card.setAttribute('data-state', 'flip');
            if(this.hasFlippedCard){
                this.secondCard=card;
                this.checkForMatch();
            }else{
                this.firstCard=card;
                this.hasFlippedCard=true;
            }
        }
    }

    addEventListeners(){
        var cards=document.querySelectorAll("article");
        cards.forEach(card => {
            card.addEventListener("click",this.flipCard.bind(this,card));
        });
    }
}

