const overview = document.querySelector(".overview");
const repoList = document.querySelector(".repo-list");
const username = "CalenFeaElen";
const repoGroup = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backToGalleryButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getGitHubInfo = async function (){
    const response = await fetch(`https://api.github.com/users/${username}`);
    const info = await response.json();
    console.log(info);
    displayGitHubUserInfo(info);
}

getGitHubInfo();

const displayGitHubUserInfo = function(info){
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${info.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${info.name}</p>
      <p><strong>Bio:</strong> ${info.bio}</p>
      <p><strong>Location:</strong> ${info.location}</p>
      <p><strong>Number of public repos:</strong> ${info.public_repos}</p>
    </div> `;
    overview.append(div);
}

const  getGitHubRepos = async function(){
    const repoResponses = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repos = await repoResponses.json();
    displayRepos(repos);

}
getGitHubRepos();

const displayRepos = function(repos){
  filterInput.classList.remove("hide");  
  for (const repo of repos){
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);

    }
}

repoList.addEventListener("click", function(e){
  if (e.target.matches("h3")){
    const repoName = e.target.innerText;
    getGitRepoInfo(repoName);
  }
})

const getGitRepoInfo = async function(repoName){
  const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await response.json();
  console.log(repoInfo);
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  const languages = [];
  for (const language in languageData){
    languages.push(language);
  }
  displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function(repoInfo, languages){
  repoData.innerHTML = "";
  repoData.classList.remove("hide");
  repoGroup.classList.add("hide");
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
  repoData.append(div);
  backToGalleryButton.classList.remove("hide");
}

backToGalleryButton.addEventListener("click", function(){
  repoGroup.classList.remove("hide");
  repoData.classList.add("hide");
  backToGalleryButton.classList.add("hide");
})

filterInput.addEventListener("input", function(e){
  const userInput = e.target.value;
  const repos = document.querySelectorAll(".repo");
  const userInputToLowerCase = userInput.toLowerCase();

  for (const repo of repos){
    const repoToLowerCase = repo.innerText.toLowerCase();
    if  (repoToLowerCase.includes(userInputToLowerCase)){
      repo.classList.remove("hide");
    }  else {
      repo.classList.add("hide");
    }
  }
})