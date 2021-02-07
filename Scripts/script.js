//Open and close the sidebar

function openNav() {
    document.getElementById("mySidenav").style.width = "250px"; // width of the menu bar is 250 px
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function removeCard(elem) {//we could animate it in js or something. Card fading away, then reappearing with a different request, but idk
    //yeah, we could also do this. Delete this with a time lag and create a new card to the right. It would feel like cards are added to the right
    //as we submit them
	//document.getElementById("request").remove(); // when the user hits submit, we should remove the card i guess? or is clearing the textarea fine?
     //submit->form->div (section is a synonym of div)
    //elem.getParent.getParent.getParent.remove();
}
