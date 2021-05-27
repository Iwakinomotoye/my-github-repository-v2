const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const userData = JSON.parse(window.localStorage.getItem("repository"));

const { user, viewer } = userData;
const {
    avatarUrl,
    bio,
    login,
    name,
    repositories,
    isViewer,
    viewerIsFollowing,
    followers,
    following,
    starredRepositories } = user;

document.getElementById("nav-profile-pic").src = viewer.avatarUrl;
document.getElementById("user-image").src = avatarUrl;
document.getElementById("tab-user-image").src = avatarUrl;
document.getElementById("real-name").textContent = name;
document.getElementById("login-name").textContent = login;
document.getElementById("tab-user-name").textContent = login;
document.getElementById("bio-content").textContent = bio;

if (followers.totalCount >= 1000) {
    followers.totalCount = (followers.totalCount / 1000).toFixed(1) + "k";
}
if (following.totalCount >= 1000) {
    following.totalCount = (following.totalCount / 1000).toFixed(1) + "k";
}
if (starredRepositories >= 1000) {
    starredRepositories.totalCount = (starredRepositories.totalCount / 1000).toFixed(1) + "k";
}
document.querySelector(".followers span").textContent = followers.totalCount;
document.querySelector(".following span").textContent = following.totalCount;
document.querySelector(".starred-repo span").textContent = starredRepositories.totalCount;

if (!isViewer) {
    document.getElementById("new-repository").classList.add("hide");
    document.querySelector(".set-status").classList.add("hide");
} else {
    document.querySelector(".follow-btn-sm").classList.add("hide");
    document.querySelector(".follow-btn").textContent = "Edit Profile";
}

if (viewerIsFollowing) {
    document.querySelector(".follow-btn").textContent = "Unfollow";
    document.querySelector(".follow-btn-sm").textContent = "Unfollow";
}

Array.from(document.querySelectorAll(".repo-count")).forEach(element => {
    element.textContent = repositories.totalCount;
})

const repoList = document.getElementById("repository-list");

repositories.nodes.forEach(repository => {
    const {
        description,
        forkCount,
        isFork,
        name,
        parent,
        pushedAt,
        viewerHasStarred,
        primaryLanguage,
        licenseInfo,
        stargazerCount } = repository;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pushedAtDate = new Date(pushedAt);
    let timeAgo = (currentDate.getTime()) - (pushedAtDate.getTime());
    // timeAgo in days
    timeAgo = timeAgo / (60 * 60 * 24 * 1000);
    roundedTimeAgo = Math.round(timeAgo);

    // code to get when the repository was last updated
    if (roundedTimeAgo > 30) {
        timeAgo = Math.round(timeAgo);
        const month = months[pushedAtDate.getMonth()];
        let day = pushedAtDate.getDate();
        let year = pushedAtDate.getFullYear();
        timeAgo = "Updated " + month + " " + day;

        if (year !== currentYear) {
            timeAgo = "Updated " + month + " " + day + ", " + year;
        }
    } else if (roundedTimeAgo < 30 && roundedTimeAgo > 2) {
        timeAgo = "Updated " + Math.round(timeAgo) + " days ago"
    } else if (roundedTimeAgo < 2 && roundedTimeAgo > 1) {
        timeAgo = Math.round(timeAgo * 24 * 60);
        timeAgo = "Updated yesterday";
    } else if (roundedTimeAgo < 2 && roundedTimeAgo > (1 / 24)) {
        timeAgo = Math.round(timeAgo * 24);
        timeAgo = "Updated " + timeAgo + " hours ago";
    } else if (roundedTimeAgo < (1 / 24) && roundedTimeAgo > (1 / (60 * 24))) {
        timeAgo = Math.round(timeAgo * 24 * 60);
        timeAgo = "Updated " + timeAgo + " minutes ago";
    } else if (roundedTimeAgo < (1 / (60 * 24)) && roundedTimeAgo > (1 / (60 * 60 * 24))) {
        timeAgo = Math.round(timeAgo * 24 * 60 * 60);
        timeAgo = "Updated " + timeAgo + " seconds ago";
    }

    // code to render the return data to the dom
    const LI = document.createElement('li');
    const divLeft = document.createElement('div');
    const divRight = document.createElement('div');
    const anchorLink = document.createElement('a');
    const pForkedFrom = document.createElement('p');
    const divDescription = document.createElement('div');
    const pDescription = document.createElement('p');
    const starButton = document.createElement('button');
    const divMoreDetails = document.createElement('div');
    const spanUpdated = document.createElement('span');
    const spanForkCount = document.createElement('span');
    const spanLangColor = document.createElement('span');
    const spanLangName = document.createElement('span');
    const spanLicense = document.createElement('span');
    const spanStarGazer = document.createElement('span');

    divLeft.classList.add("column-three");
    divRight.classList.add("column-four");
    divRight.classList.add("right-align");

    anchorLink.textContent = name;
    anchorLink.classList.add("repo-name");
    anchorLink.setAttribute('href', "#" + name);
    divLeft.append(anchorLink);

    if (isFork) {
        pForkedFrom.classList.add("forked-details")
        pForkedFrom.innerHTML = "Forked from " + parent.nameWithOwner;
        divLeft.append(pForkedFrom);
    }

    pDescription.classList.add("repo-description");
    pDescription.textContent = description;
    divDescription.append(pDescription);
    divLeft.append(divDescription);


    if (primaryLanguage) {
        spanLangColor.classList.add("repo-language-color");
        spanLangColor.style.background = primaryLanguage.color;
        spanLangColor.style.borderColor = primaryLanguage.color + "32";

        spanLangName.classList.add("mr-16");
        spanLangName.textContent = primaryLanguage.name;
        divMoreDetails.append(spanLangColor);
        divMoreDetails.append(spanLangName);
    }

    if (stargazerCount) {
        spanStarGazer.classList.add("mr-16");
        spanStarGazer.innerHTML = '<img class="svg-image" src="./images/star-path.svg" /> ' + stargazerCount;
        divMoreDetails.append(spanStarGazer);
    }

    if (isFork) {
        let theForkCount = parent.forkCount.toLocaleString();

        spanForkCount.classList.add("mr-16");
        spanForkCount.innerHTML = '<img class="svg-image" src="./images/fork-icon.svg" /> ' + theForkCount;
        divMoreDetails.append(spanForkCount);
    } else if (!isFork && forkCount > 0) {
        spanForkCount.classList.add("mr-16");
        spanForkCount.innerHTML = '<img class="svg-image" src="./images/fork-icon.svg" /> ' + forkCount;
        divMoreDetails.append(spanForkCount);
    }

    if (licenseInfo) {
        spanLicense.classList.add("mr-16");
        spanLicense.innerHTML = '<img class="svg-image" src="./images/mit-icon.svg" /> ' + licenseInfo.name;
        divMoreDetails.append(spanLicense);
    }

    spanUpdated.textContent = timeAgo;
    divMoreDetails.append(spanUpdated);

    divMoreDetails.classList.add("repo-more-details");
    divLeft.append(divMoreDetails);

    if (!viewerHasStarred) {
        starButton.innerHTML = '<img class="svg-image" src="./images/star-path.svg" /> Star';
    } else {
        starButton.innerHTML = '<img class="svg-image" src="./images/star-solid.svg" /> Unstar';
    }

    starButton.classList.add("custom-button");
    divRight.append(starButton);

    LI.append(divLeft);
    LI.append(divRight);

    repoList.append(LI);
})

// code to hide and show user image icon and name on mini nav section
let tabProfile = document.querySelector(".tab-profile");
function showTabProfile() {
    tabProfile.classList.toggle("hide");
}


let options = {
    threshold: 1
}

let observer = new IntersectionObserver(showTabProfile);
let target = document.querySelector(".profile-img-container");

observer.observe(target);

document.querySelector(".copyright").innerHTML = "&copy; " + currentYear + " GitHub, Inc.";