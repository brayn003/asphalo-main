function sidebarScroll() {
	// var nav = document.getElementById('scroll-nav');
	var elemIndex = $('#scroll-nav').children('.active').index(),
		elemHeight = $('#scroll-nav').children('li:not(.active)').outerHeight(),
		activeHeight = $('#scroll-nav').children('li.active').outerHeight(),
		currentOffset = $('#scroll-nav').offset().top;
	
		// console.log(elemIndex,elemHeight,active)

	var newOffset = window.innerHeight/2 - (elemIndex*elemHeight)-(activeHeight/2);

	// console.log($('#scroll-nav').children('.active').index())
	// console.log($('#scroll-nav').children('li:not(.active)').outerHeight())
	// console.log($('#scroll-nav').children('li.active').outerHeight())
	console.log('correntoffset',currentOffset)
	console.log('newoffset',newOffset)
	// console.log(newOffset - currentOffset)
	// console.log( newOffset - ((activeHeight/2)-currentOffset))

	$('#scroll-nav').css('transform','translate3d(0,'+(newOffset - currentOffset)+'px,0)');
}
sidebarScroll()

function toggleActiveClass(){
	$('#scroll-nav').children('li').each(function(){
		$(this).click(function(){
			$('#scroll-nav').children('li').each(function(){
				$(this).removeClass('active');
			})
			$(this).addClass('active');
			// setTimeout(function(){
				sidebarScroll();
			// },2000)
		})
	})
}

toggleActiveClass()