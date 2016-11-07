	const getList = function(){
	 $('#todolist').html('');
	const searchtext = $('#searchtextbox').val();
	   
	   $.ajax({
        url      : "/todos",
        type     : 'get',
        dataType : 'json',
        data     : {
            searchtext : searchtext
        },
        success  : function (data){
			
				data.forEach(function(item){
				let li=$('<li>'+item.message+'<input type="checkbox"  class="checkbox"  ></input>'+'<button class="delete">Delete</button>'+'</li>');
				
				li.find('.delete').on('click',function(){
				
						$.ajax({
					url     : "/todos/" + item.id,
					type    : 'delete',
					success : function(data) {
								li.remove();
					},
					error   : function(data) {
						alert('Error deleting the item');
					}
					});
				});
					li.find('input').prop('checked', item.completed).on('change', function(){
					const completed=$(this).prop('checked');
					item.completed=completed;
							$.ajax({
				url         : "/todos/" +item.id,
				type        : 'put',
				dataType    : 'json',
				data        : JSON.stringify(item),
				contentType : "application/json; charset=utf-8",
				success     : function(data) {
				

				},
				error       : function(data) {
					alert('Error creating todo');
				}
				});
				});
				$('#todolist').append(li);
				});
		},
        error    : function(data) {
            alert('Error searching');
        }
    });
	   };

  
   
  getList();
  
  $('#searchbutton').on('click',function(){
	getList();
	});
  
   	$('#addbutton').on('click', function(){
		$('#addbox').val();
		
    $.ajax({
        url         : "/todos",
        type        : 'post',
        dataType    : 'json',
        data        : JSON.stringify({
            message   : $('#addbox').val()
            
        }),
        contentType : "application/json",
        contentType : "application/json",
        success     : function(data) {
		
				getList();
		
		      },
        error       : function(data) {
            alert('Error creating todo');
        }
    });
	$('#addbox').val(''); 
	});

   
   
 	