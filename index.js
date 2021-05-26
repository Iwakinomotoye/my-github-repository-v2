const usernameForm = document.getElementById("username-form");
const okay = document.getElementById("okay");
const modalBg = document.querySelector(".modal-bg");
const circleContainer = document.querySelector(".circle-container");
const modalContent = document.querySelector(".modal-content");
let username = "";

usernameForm.onsubmit = function loadProfile(event) {
  event.preventDefault();

  modalBg.classList.remove("hide");

  username = document.getElementById("github-username").value;

  fetchData().then((data) => {
    if (data.data.user && data.data.viewer) {
      window.localStorage.setItem("repository", JSON.stringify(data.data));
      window.location.href = "profile.html";
    } else {
      handleError(data);
    }
  })
  .catch(() => {
    let error = {
      errors: [
        {message: "Network not available. Please check your network and try again."}
      ]
    }
    handleError(error);
  })
}

function handleError(error) {
  circleContainer.classList.add("hide");
  modalContent.classList.remove("hide");

  document.querySelector(".modal-content p").textContent = error.errors[0].message;
}

okay.onclick = function () {
  modalBg.classList.add("hide");
  circleContainer.classList.remove("hide");
  modalContent.classList.add("hide");
}

// code to call github api with the query below
const createQuery = (username) => `{
  user(login: "${username}") {
    login
    bio
    name
    avatarUrl
    isViewer
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    repositories(orderBy: {field: PUSHED_AT, direction: DESC}, first: 20, ownerAffiliations: OWNER) {
      nodes {
        id
        name
        description
        forkCount
        viewerHasStarred
        isFork
        pushedAt
        stargazerCount
        parent {
          nameWithOwner
          forkCount
        }
        primaryLanguage {
          color
          name
        }
        licenseInfo {
          name
        }
      }
      totalCount
    }
    viewerIsFollowing
  }
  viewer {
    avatarUrl
  }
}`;

const tokenPart1 = "ghp_";
const tokenPart2 = "Y7FoWcVWZjlnqrf3H5eZCuRt1LbYvt3aSi2X"

const fetchData = () => {
    return new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tokenPart1 + tokenPart2,
            },
            body: JSON.stringify({ query: createQuery(username) })
        }
        fetch("https://api.github.com/graphql", options)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    })
}