
function sidebarScroll() {
	// var nav = document.getElementById('scroll-nav');
	var elemIndex = $('#scroll-nav').children('.active').index(),
		elemHeight = $('#scroll-nav').children('li:not(.active)').outerHeight(),
		activeHeight = $('#scroll-nav').children('li.active').outerHeight();

	var newOffset = window.innerHeight/2 - (elemIndex*elemHeight)-(activeHeight/2);

	$('#scroll-nav').css('transform','translate3d(0,'+(newOffset)+'px,0)');
}

function goToIndex(index) {
	$('#scroll-nav').children('li').each(function(){
		$(this).removeClass('active');
	})
	$('#scroll-nav').children('li').eq(index).addClass('active');
	sidebarScroll();
}

function scrollInit(){
	sidebarScroll();
	$('#fullpage').fullpage({
		css3: true,
		onLeave: function(index, nextIndex, direction){
            goToIndex(nextIndex-1);
        }
	});
}

scrollInit();