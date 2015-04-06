
	var shop_name = "Owls House"; // NAMA TOKO ONLINE
	var domain = "http://owls-house.com/mobile/"; // DOMAIN URL ADMIN
	var admin_url = domain;
	
	var base_url = domain+"_api_/android"; // URL API
	var base_url_media = admin_url+"media"; // DIREKTORI PENYIMPANAN IMAGE DI HOSTING
	var dir_image = "Pictures/OwlsHouse"; // DIREKTORI PENYIMPANAN IMAGE DI SD CARD
	var token = "56269f88b85f6fb6e3b2803f0ac09f65"; // ISI DENGAN TOKEN 
	
var cart_item_id = new Array();
	var cart_item_qty = new Array();
	var cart_item_price = new Array();
	var cart_item_subtotal = new Array();
	var cart_item_weight = new Array();
	
	$( document ).on( "click", ".show-page-loading-msg", function() {
		var $this = $( this ),
			theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
			msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
			textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
			textonly = !!$this.jqmData( "textonly" );
			html = $this.jqmData( "html" ) || "";
		$.mobile.loading( "show", {
				text: msgText,
				textVisible: textVisible,
				theme: theme,
				textonly: textonly,
				html: html
		});
	})

	// CHECK NEW MESSAGE
	$( document ).on( "click", ".check_new_message", function() {
		var login_customer_id = localStorage.getItem('Customer_id');
		$.post(base_url+"/get_total_unread_message", { token: token, customer_id: login_customer_id},
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */ 		
			
			if(data.total > 0) 
			{
				$(".unread_message").html(data.total);
			}
			else
			{
				$(".unread_message").html('');
			}	
			 
		}, "json");
	});

	// CHECK AUTH
	function cek_status() {
		
		var login_status = localStorage.getItem('Login');
		var login_customer_id = localStorage.getItem('Customer_id');
		var login_customer_name = localStorage.getItem('Customer_name');
		var login_customer_email = localStorage.getItem('Customer_email');
		
		if (login_status) {
			
			//unread message check
			$.post(base_url+"/get_total_unread_message", {token: token, customer_id: login_customer_id},
		   	function(data){
			 
				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
				else
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				
				else
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				
				else
				{
					var customer_id = login_customer_id;
					var customer_name = login_customer_name;
					var customer_email = login_customer_email;
						
					$(".info-login-status").html(customer_name+" ( Cust.ID: <span class='customer_id'>"+customer_id+"</span> )");
						
					window.location = "#page_dashboard";
						
					$("#login_customer_id").val("");
					$("#password").val("");
					$("#login_message").html("");
						 

					var login_status = 1;
					localStorage.setItem('Login',login_status);
					localStorage.setItem('Customer_id',login_customer_id);
					localStorage.setItem('Customer_name',login_customer_name);
					localStorage.setItem('Customer_email',login_customer_email);
					
					if(data.total > 0) 
					{
						$(".unread_message").html(data.total);
					}
					else
					{
						$(".unread_message").html('');
					}	
				}
				/* end check */ 		
			 
				
			 
			 
			}, "json");
			
			
			
		}
		else
		{
			window.location = "#page_login";
		}
		
		onLoad();
	}
	
	function check_token()
	{
		alert('Invalid Token');
		window.location = "#page_login";
		return false;		
	}
	
	function check_status_aplikasi(message)
	{
		$("#notif_message").html(message);
		window.location = "#page_notifikasi";
		return false;		
	}
	
	function check_status_member()
	{
		$("#notif_message").html("Status member anda tidak aktif");
		window.location = "#page_notifikasi";
		return false;		
	}
	
	function check_status_member_not_found()
	{
		$("#login_message").html("<div class='alert-error'>Member Not Found</div>");
		window.location = "#page_login";
		return false;		
	}
	
	// LOGIN 
	$( document ).on( "submit", "#form_login", function() {

		var login_customer_id = $("#login_customer_id").val();
		var password = $("#password").val();
		
		window.location = "#page_loading";
		
		$.post(base_url+"/login", { token: token, customer_id: login_customer_id, password: password },
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			
			/* end check */ 			
			
			if(data.status == 'Failed')
			{
				$("#login_message").html("<div class='alert-error'>"+data.error+"</div>");
				window.location = "#page_login";	
			}
			else if(data.status == 'Success')
			{		
				var customer_id = data.customer_id;
				var customer_name = data.customer_name;
				var customer_email = data.customer_email;
				
				$(".info-login-status").html(data.customer_name+" ( Cust.ID: <span class='customer_id'>"+data.customer_id+"</span> )");
				
				window.location = "#page_dashboard";
				
				 $("#login_customer_id").val("");
				 $("#password").val("");
				 $("#login_message").html("");
				 
				var login_status = 1;
				localStorage.setItem('Login',login_status);
				localStorage.setItem('Customer_id',customer_id);
				localStorage.setItem('Customer_name',customer_name);
				localStorage.setItem('Customer_email',customer_email);
			}	
			 
		}, "json");
		

		return false;
	});	
	
	// REGISTER PAGE
	$( document ).on( "click", "#btn_page_register", function() {
		$.post(base_url+"/get_ship_rates_prov",{token: token}, 
			   function(data_prov){
					
					/* check */
					if(data_prov.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data_prov.status == 'OFF')
					{
						check_status_aplikasi(data_prov.message);
					}
					if(data_prov.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data_prov.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
							
					var listing_prov = data_prov.list;
					
					for(var a=0;a < listing_prov.length;a++)
					{
						var x = "<option value='"+listing_prov[a].id+"'>"+listing_prov[a].nama+"</option>";
						$("#register_provinsi").append(x);
					}

		}, "json");
	});	
	
	$( document ).on( "change", "#register_provinsi", function() {
	
		$.mobile.loading( "show" );
	
		var prov_id = $(this).val();
		
		if(prov_id != "")
		{
			$("#register_kota").removeAttr("disabled");
			
			$.post(base_url+"/get_ship_rates_city",{ token: token, prov_id:  prov_id},
			   function(data_city){
			
					/* check */
					if(data_city.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data_city.status == 'OFF')
					{
						check_status_aplikasi(data_city.message);
					}
					if(data_city.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data_city.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
					
					var listing_city = data_city.list;
					
					$("#register_kota").html("");
					$("#register_kota").html("<option value=''>- PILIH KOTA -</option>");
					for(var a=0;a < listing_city.length;a++)
					{
						var x = "<option value='"+listing_city[a].id+"'>"+listing_city[a].nama+"</option>";
						$("#register_kota").append(x);
					}
					
					$.mobile.loading( "hide" );

			}, "json");
		
		}
		else
		{
			$("#register_kota").attr("disabled","disabled");
			$("#register_kota").html("<option value=''>- PILIH KOTA -</option>");
			$.mobile.loading( "hide" );
		}
	});	
	
	$( document ).on( "click", "#btn_page_register", function() {
	
		$("#register_name").val('');
		$("#register_email").val('');
		$("#register_password").val('');
		$("#register_confirm_password").val('');
		$("#register_alamat").val('');
		$("#register_kodepos").val('');
		$("#register_phone").val('');
		$("#register_pinbb").val('');
	
		$.post(base_url+"/get_ship_rates_prov",{token: token},
			   function(data_prov){
					
					/* check */
					if(data_prov.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data_prov.status == 'OFF')
					{
						check_status_aplikasi(data_prov.message);
					}
					if(data_prov.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data_prov.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
					
					var listing_prov = data_prov.list;
					
					for(var a=0;a < listing_prov.length;a++)
					{
						var x = "<option value='"+listing_prov[a].id+"'>"+listing_prov[a].nama+"</option>";
						$("#register_provinsi").append(x);
					}

		}, "json");
	});		
		
	// REGISTER
	$( document ).on( "click", "#register-button", function() {

		var register_name = $("#register_name").val();
		var register_email = $("#register_email").val();
		var register_password = $("#register_password").val();
		var register_confirm_password = $("#register_confirm_password").val();
		var register_alamat = $("#register_alamat").val();
		var register_provinsi = $("#register_provinsi").val();
		var register_kota = $("#register_kota").val();
		var register_kodepos = $("#register_kodepos").val();
		var register_phone = $("#register_phone").val();
		var register_pinbb = $("#register_pinbb").val();
		
		if( (register_name != '') && (register_email != '') && (register_password != '') && (register_confirm_password != '') && (register_alamat != '') && (register_provinsi != '') && (register_kota != '') && (register_kodepos != '') && (register_phone != '') && (register_pinbb != ''))
		{
			window.location = "#page_loading";
			
			$.post(base_url+"/register", { token: token, nama: register_name, email: register_email, password: register_password, alamat: register_alamat, provinsi: register_provinsi, kota: register_kota, kodepos: register_kodepos, phone: register_phone, pinbb: register_pinbb },
			   function(data){
			   
				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */ 
			   
				if(data.status == 'Failed')
				{
					window.location = "#page_register";
				}
				else
				{
					window.location = "#page_login";
					$("#login_message").html("<div class='alert-success'>Registrasi Berhasil, silahkan konfirmasi Admin kami untuk aktivasi! Anda terdaftar dengan <br/>Customer ID : "+data.customer_id+" <br/> Password : "+data.password+"</div>");
				}	
				 
			}, "json");
		}
		else
		{
			window.location = "#page_register";
			$("#register_message").html("<div class='alert-error'>Please completed fields</div>");
		}
		
	});	

	// GET LIST PRODUCT
	function get_list_product(page)
	{
		var customer_id = $(".customer_id").html();
		var page = parseInt(page);
		var prev_page = page - 1;
		var next_page = page + 1;
		
		$.post(base_url+"/get_list_product", { token: token, page: page, customer_id: customer_id},
		   function(data){

				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */ 
				
				var item = data.product;
				var item_length = item.length;
				
				for(var i = 0; i <= 5; i++)  
				{		
					var listing = "#list_product #list_"+i;
					
					if(i < item_length)
					{	
						$(listing).show();
						$(listing+" img").attr("src",base_url_media+"/images/medium/"+item[i].foto); 
						$(listing+" h2").html(item[i].name_item);
						var harga = numeral(item[i].harga).format('0.00');
						$(listing+" p").html("Rp."+harga);
						$(listing+" a").attr("rel",item[i].product_id);
					}
					else
					{
						$(listing).hide();
					}
				}
				
				$("#page_product_prev").attr("rel",prev_page);
				$("#page_product_current").html(page);
				$("#page_product_next").attr("rel",next_page);
				
				window.location = "#page_product";
				
		}, "json");
	}		

	// ACTION LIST PRODUCT CATEGORY FROM MENU DASHBOARD
	// Ready
	$(document).on('pageinit',function(event){
		$( document ).on( "click", ".menu_page_product_category", function() {

				var customer_id = $(".customer_id").html();
				var page = $(this).attr("rel");
				var page = parseInt(page);
				var prev_page = page - 1;
				var next_page = page + 1;
				
					
				$.post(base_url+"/get_list_product_category",{token: token, tipe: 'Ready Stock',page: page , customer_id: customer_id},
				 
				   function(data){
					
					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
					
					if(data.status == 'Error')
				   {
						alert("No Data");
						$.mobile.loading( "hide" );
						return false;
					}	
					
					if(data.status == 'Success')
				   {
						var categories = data.category;
						var categories_length = categories.length;
						
						
							for(var i = 0; i < 10; i++)  
							{	
								
								var listing = "#content_list_category #list_"+i;
								
								if(i < categories_length)
								{	
									$(listing).show();
									$(listing+" a").attr("title",categories[i].id);
									$(listing+" a").html(categories[i].name);
								}
								else
								{
									$(listing).hide();
								}
							}
							
							$("#page_product_category_prev").attr("rel",prev_page);
							$("#page_product_category_current").html(page);
							$("#page_product_category_next").attr("rel",next_page);
							
							window.location = "#page_product_category";

					}
					else
					{		
						get_list_product_category(prev_page);
					}	
					
					
				}, "json");
		
		});
	});
	
	//PO
	$(document).on('pageinit',function(event){
		$( document ).on( "click", ".menu_page_product_category_po", function() {

				var customer_id = $(".customer_id").html();
				var page = $(this).attr("rel");
				var page = parseInt(page);
				var prev_page = page - 1;
				var next_page = page + 1;
	
				$.post(base_url+"/get_list_product_category",{token: token, tipe: 'PO', page: page , customer_id: customer_id},
				 
				   function(data){
					
					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
					
					if(data.status == 'Error')
				   {
						alert("No Data");
						$.mobile.loading( "hide" );
						return false;
					}	
					
					if(data.status == 'Success')
				   {
						var categories = data.category;
						var categories_length = categories.length;
						
						for(var i = 0; i < 10; i++)  
						{	
							
							var listing = "#content_list_category #list_"+i;
							
							if(i < categories_length)
							{	
								$(listing).show();
								$(listing+" a").attr("title",categories[i].id);
								$(listing+" a").html(categories[i].name);
							}
							else
							{
								$(listing).hide();
							}
						}
						
						$("#page_product_category_prev_po").attr("rel",prev_page);
						$("#page_product_category_current_po").html(page);
						$("#page_product_category_next_po").attr("rel",next_page);
						
						window.location = "#page_product_category_po";
						
					}
					else
					{		
						get_list_product_category(prev_page);
					}	
					
					
				}, "json");
		
		});
	});

	// ACTION LIST PRODUCT FROM MENU DASHBOARD
	// Ready
	
	$( document ).on( "click", ".menu_page_product", function() {
		
		$("#product_notif").html("");
		
		var customer_id = $(".customer_id").html();
		var category = $(this).attr("title");
		 
		var page = $(this).attr("rel");
		var page = parseInt(page);
		var prev_page = page - 1;
		var next_page = page + 1;

			$.post(base_url+"/get_list_product", {token: token, tipe: 'Ready Stock', page: page, category: category, customer_id: customer_id},
			   function(data){

				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */ 
			   
				if(data.status == 'Not_found')
				{
					$("#product_notif").html("<center>Data tidak ada</center>");
					$(".product_detail_list").hide();	
					$("#page_product_current").html("1");
					
					window.location = "#page_product";
					
				}
				else	
				if(data.status == 'Success')
				{
					var item = data.product;
					var item_length = item.length;
					$("#product_notif").html("");
					for(var i = 0; i < 20; i++)  
					{	
						
						var listing = "#list_product #list_"+i;
						
						if(i < item_length)
						{	
							$(listing).show();
							$(listing+" img").attr("src",item[i].img_thumbnail); 
							$(listing+" h2").html(item[i].name_item);
							
							var item_harga_lama = parseFloat(item[i].harga_lama);
							
							if(item_harga_lama > 0)
							{
								var harga_lama = numeral(item_harga_lama).format('0.00');
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
								
							}
							else
							{
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("Rp."+harga);
							}	
							
							$(listing+" a").attr("rel",item[i].product_id);
						}
						else
						{
							$(listing).hide();
						}
					}
					
					$("#info_page_product").html(page);
					$("#info_total_page_product").html(data.total_page);
					
					$("#page_product_prev").attr("rel",prev_page);
					$("#page_product_prev").attr("title",category);
					$("#page_product_current").html(page);
					$("#page_product_next").attr("rel",next_page);
					$("#page_product_next").attr("title",category);
					
					$("#refresh_product").attr("rel",1);
					$("#refresh_product").attr("title",category);
					
					window.location = "#page_product";
					
				}
				else if(data.status == 'Failed')
				{		
					get_list_product(prev_page);
				}	
				
			}, "json");
			
			$.mobile.loading( "hide" );
	
	});
	
	
	// Ready (function)
	function get_list_product_ready(category_id)
	{
		$("#product_notif").html("");
		
		var customer_id = $(".customer_id").html();
		var category = category_id;
		 
		var page = 1;
		var page = parseInt(page);
		var prev_page = page - 1;
		var next_page = page + 1;

			$.post(base_url+"/get_list_product", {token: token, tipe: 'Ready Stock', page: page, category: category, customer_id: customer_id},
			   function(data){

				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */ 
			   
				if(data.status == 'Not_found')
				{
					$("#product_notif").html("<center>Data tidak ada</center>");
					$(".product_detail_list").hide();	
					$("#page_product_current").html("1");
					
					window.location = "#page_product";
					
				}
				else	
				if(data.status == 'Success')
				{
					var item = data.product;
					var item_length = item.length;
					$("#product_notif").html("");
					for(var i = 0; i < 20; i++)  
					{	
						
						var listing = "#list_product #list_"+i;
						
						if(i < item_length)
						{	
							$(listing).show();
							$(listing+" img").attr("src",item[i].img_thumbnail); 
							$(listing+" h2").html(item[i].name_item);
							
							var item_harga_lama = parseFloat(item[i].harga_lama);
							
							if(item_harga_lama > 0)
							{
								var harga_lama = numeral(item_harga_lama).format('0.00');
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
								
							}
							else
							{
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("Rp."+harga);
							}	
							
							$(listing+" a").attr("rel",item[i].product_id);
						}
						else
						{
							$(listing).hide();
						}
					}
					
					$("#info_page_product").html(page);
					$("#info_total_page_product").html(data.total_page);
					
					$("#page_product_prev").attr("rel",prev_page);
					$("#page_product_prev").attr("title",category);
					$("#page_product_current").html(page);
					$("#page_product_next").attr("rel",next_page);
					$("#page_product_next").attr("title",category);
					
					$("#refresh_product").attr("rel",1);
					$("#refresh_product").attr("title",category);
					
					window.location = "#page_product";
					
				}
				else if(data.status == 'Failed')
				{		
					get_list_product(prev_page);
				}	
				
			}, "json");
			
			$.mobile.loading( "hide" );
	}
	
	//PO
	
	$( document ).on( "click", ".menu_page_product_po", function() {
		
		$("#product_po_notif").html("");
		
		var customer_id = $(".customer_id").html();
		var category = $(this).attr("title");
		 
		var page = $(this).attr("rel");
		var page = parseInt(page);
		var prev_page = page - 1;
		var next_page = page + 1;

			$.post(base_url+"/get_list_product", {token: token, tipe: 'PO', page: page, category: category, customer_id: customer_id},
			   function(data){
				
				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */ 
				
				if(data.status == 'Not_found')
				{
					$("#product_po_notif").html("<center>Data tidak ada</center>");
					$(".product_detail_list").hide();	
					$("#page_product_current").html("1");
					
					window.location = "#page_product_po";
					
				}
				else	
				
			   if(data.status == 'Success')
			   {
					var item = data.product;
					var item_length = item.length;
					$("#product_notif").html("");
					for(var i = 0; i < 20; i++)  
					{	
						
						var listing = "#list_product #list_"+i;
						
						if(i < item_length)
						{	
							$(listing).show();
							$(listing+" img").attr("src",item[i].img_thumbnail); 
							$(listing+" h2").html(item[i].name_item);
							
							var item_harga_lama = parseFloat(item[i].harga_lama);
							
							if(item_harga_lama > 0)
							{
								var harga_lama = numeral(item_harga_lama).format('0.00');
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
								
							}
							else
							{
								var harga = numeral(item[i].harga).format('0.00');
								$(listing+" p").html("Rp."+harga);
							}	
							
							$(listing+" a").attr("rel",item[i].product_id);
						}
						else
						{
							$(listing).hide();
						}
					}
					
					$("#info_page_product_po").html(page);
					$("#info_total_page_product_po").html(data.total_page);
					
					$("#page_product_prev_po").attr("rel",prev_page);
					$("#page_product_prev_po").attr("title",category);
					$("#page_product_current_po").html(page);
					$("#page_product_next_po").attr("rel",next_page);
					$("#page_product_next_po").attr("title",category);
					
					$("#refresh_product_po").attr("rel",1);
					$("#refresh_product_po").attr("title",category);
					
					window.location = "#page_product_po";
					
				}
				else if(data.status == 'Failed')
				{		
					get_list_product(prev_page);
				}	
				
				
			}, "json");
			
			$.mobile.loading( "hide" );
	
	});
	

	
	// PO (function)
	function get_list_product_po(category_id)
	{
			$("#product_po_notif").html("");
			
			var customer_id = $(".customer_id").html();
			var category = category_id;
			 
			var page = 1;
			var page = parseInt(page);
			var prev_page = page - 1;
			var next_page = page + 1;

				$.post(base_url+"/get_list_product", {token: token, tipe: 'PO', page: page, category: category, customer_id: customer_id},
				   function(data){
					
					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
					
					if(data.status == 'Not_found')
					{
						$("#product_po_notif").html("<center>Data tidak ada</center>");
						$(".product_detail_list").hide();	
						$("#page_product_current").html("1");
						
						window.location = "#page_product_po";
						
					}
					else	
					
				   if(data.status == 'Success')
				   {
						var item = data.product;
						var item_length = item.length;
						$("#product_notif").html("");
						for(var i = 0; i < 20; i++)  
						{	
							
							var listing = "#list_product #list_"+i;
							
							if(i < item_length)
							{	
								$(listing).show();
								$(listing+" img").attr("src",item[i].img_thumbnail); 
								$(listing+" h2").html(item[i].name_item);
								
								var item_harga_lama = parseFloat(item[i].harga_lama);
								
								if(item_harga_lama > 0)
								{
									var harga_lama = numeral(item_harga_lama).format('0.00');
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
									
								}
								else
								{
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("Rp."+harga);
								}	
								
								$(listing+" a").attr("rel",item[i].product_id);
							}
							else
							{
								$(listing).hide();
							}
						}
						
						$("#info_page_product_po").html(page);
						$("#info_total_page_product_po").html(data.total_page);
						
						$("#page_product_prev_po").attr("rel",prev_page);
						$("#page_product_prev_po").attr("title",category);
						$("#page_product_current_po").html(page);
						$("#page_product_next_po").attr("rel",next_page);
						$("#page_product_next_po").attr("title",category);
						
						$("#refresh_product_po").attr("rel",1);
						$("#refresh_product_po").attr("title",category);
						
						window.location = "#page_product_po";
						
					}
					else if(data.status == 'Failed')
					{		
						get_list_product(prev_page);
					}	
					
					
				}, "json");
				
				$.mobile.loading( "hide" );
	}
	
	// SEARCH PRODUCT READY STOCK
	$( document ).on( "submit", "#form_search", function() {
	
			//$("#overlay-loading").show();
	
			var customer_id = $(".customer_id").html();
			
			var page = 1;
			var q = $("#search_query").val();
			var page = parseInt(page);
			var prev_page = page - 1;
			var next_page = page + 1;

				$.post(base_url+"/get_search_product", {token: token, page: page, q: q , customer_id: customer_id},
				   function(data){

					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
				   
				   if(data.status == 'Success')
				   {
						var item = data.product;
						var item_length = item.length;
						
						for(var i = 0; i < 20; i++)  
						{	
							
							var listing = "#list_product #list_"+i;
							
							if(i < item_length)
							{	
								$(listing).show();
								$(listing+" img").attr("src",item[i].img_thumbnail); 
								$(listing+" h2").html(item[i].name_item);
								
								var item_harga_lama = parseFloat(item[i].harga_lama);
								
								if(item_harga_lama > 0)
								{
									var harga_lama = numeral(item_harga_lama).format('0.00');
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
									
								}
								else
								{
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("Rp."+harga);
								}	
								
								$(listing+" a").attr("rel",item[i].product_id);
							}
							else
							{
								$(listing).hide();
							}
						}
						
						
						$("#info_page_product").html(page);
						$("#info_total_page_product").html(data.total_page);
						$("#page_product_prev").attr("rel",prev_page);
						$("#page_product_current").html(page);
						$("#page_product_next").attr("rel",next_page);
						
						window.location = "#page_product";
						//$("#overlay-loading").hide();
						$.mobile.loading( "hide" );
						
						
					}
					else
					{		
						alert("Data Not Found");
						window.location = "#page_product";
						//$("#overlay-loading").hide();
						$.mobile.loading( "hide" );
					}	
					
				}, "json");
				
				
				
		
		return false;
	});	
	
	// SEARCH PRODUCT PO
	$( document ).on( "submit", "#form_search_po", function() {

			var customer_id = $(".customer_id").html();
	
			var page = 1;
			var q = $("#search_query").val();
			var page = parseInt(page);
			var prev_page = page - 1;
			var next_page = page + 1;

				$.post(base_url+"/get_product_search", {token: token, page: page, q: q, customer_id: customer_id},
				   function(data){

					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */ 
				   
				   if(data.status == 'Success')
				   {
						var item = data.product;
						var item_length = item.length;
						
						for(var i = 0; i < 20; i++)  
						{	
							
							var listing = "#list_product #list_"+i;
							
							if(i < item_length)
							{	
								$(listing).show();
								$(listing+" img").attr("src",item[i].img_thumbnail); 
								$(listing+" h2").html(item[i].name_item);
								
								var item_harga_lama = parseFloat(item[i].harga_lama);
								
								if(item_harga_lama > 0)
								{
									var harga_lama = numeral(item_harga_lama).format('0.00');
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
									
								}
								else
								{
									var harga = numeral(item[i].harga).format('0.00');
									$(listing+" p").html("Rp."+harga);
								}	
								
								$(listing+" a").attr("rel",item[i].product_id);
							}
							else
							{
								$(listing).hide();
							}
						}
						
						$("#info_page_product_po").html(page);
						$("#info_total_page_product_po").html(data.total_page);
						
						$("#page_product_prev").attr("rel",prev_page);
						$("#page_product_current").html(page);
						$("#page_product_next").attr("rel",next_page);
						
						window.location = "#page_product";
						$.mobile.loading( "hide" );
						
						
					}
					else
					{		
						get_list_product(prev_page);
						$.mobile.loading( "hide" );
					}	
					
				}, "json");
				
				
		
		return false;
	});	

	// GET PRODUCT DETAIL PAGE
	$( document ).on( "click", ".product_detail_button", function() {
		
		var customer_id = $(".customer_id").html();
		var prod_id = $(this).attr("rel");
			
		$.post(base_url+"/get_detail_product", {token: token, prod_id: prod_id, customer_id: customer_id },
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#product_detail_name").html(data.name_item);
			$("#product_detail_description").html(data.keterangan);
			
			var image_path = data.img_large;
			$("#product_detail_image").attr("src",image_path);
			
			var variants = data.variant;
			
			$("#select-variant").html("");
			$("#select-variant").html("<option value='' selected='selected'>- Please Select variant -</option>");
			
			for(var i = 0; i < variants.length; i++)  
			{	
			
					if (variants[i].variant_name == null)
					{
						$("#select-variant").append("<option value=''>Select variant</option>");
					}
					else
					{
						if((data.view_stock == 1) || (data.view_stock == 2))
						{
							if(data.view_stock ==1)
							{			
								$("#select-variant").append("<option value='"+variants[i].id_variant+"'>"+variants[i].variant_name+" ("+variants[i].stock+")</option>");
							}
							else
							{
								if(variants[i].stock == 'HABIS')
								{
									$("#select-variant").append("<option value='"+variants[i].id_variant+"'>"+variants[i].variant_name+" ("+variants[i].stock+")</option>");		
								}
								else
								{
									$("#select-variant").append("<option value='"+variants[i].id_variant+"'>"+variants[i].variant_name+"</option>");
								}
							}	
						}
						else
						{
							$("#select-variant").append("<option value='"+variants[i].id_variant+"'>"+variants[i].variant_name+"</option>");
						}
					}	
			
			}
			
			var item_harga_lama = parseFloat(data.harga_lama);
			var harga = numeral(data.harga).format('0.00');
			var harga_lama = numeral(item_harga_lama).format('0.00');
			
			if(item_harga_lama > 0)
			{
				$("#product_detail_price").html("<strike><font color='red'>Rp."+harga_lama+"</font></strike> Rp."+harga);
			}
			else
			{
				$("#product_detail_price").html("Rp."+harga);
			}
			
			// Placing variable to item 
			$("#item_id").val(data.product_id);
			$("#item_category").val(data.category_id);
			$("#item_name").val(data.name_item);
			$("#item_price").val(data.harga);
			$("#item_ukuran").val(data.ukuran);
			$("#item_images").val(data.foto);
			$("#item_qty").val('');
			$("#item_notes").val('');
			$("#item_qty").attr("placeholder","Minimal : "+data.min_order);
			$("#item_min_order").val(data.min_order);
			
			window.location = "#page_detail";
			
		}, "json");
		
	});	
	

	// SAVE IMAGES
	$( document ).on( "click", "#btn_save_image", function() {
		
		var file_img = $("#item_images").val();
		var file_name = $("#item_name").val();
		var file_price = $("#item_price").val();
		
		download(file_img, dir_image, admin_url);
		
	});

	// GET PRODUCT DETAIL
	function get_product_detail(prod_id)
	{
		// var prod_id = $(this).attr("rel");
		
		var customer_id = $(".customer_id").html();
		
		$.post(base_url+"/get_detail_product", {token: token, prod_id: prod_id, customer_id: customer_id },
		   function(data){
		   
		   /* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#product_detail_name").html(data.name_item);
			
			window.location = "#page_detail";
			
		}, "json");
		
	}

	// GO ORDER PRODUCT
	$( document ).on( "click", "#btn_order", function() {

		var customer_id = $(".customer_id").html();
		var order_prod_id = $("#item_id").val();
		var order_category_id = $("#item_category").val();
		var order_variant_id = $("#select-variant").val();
		var order_qty = $("#item_qty").val();
		var order_price = $("#item_price").val();
		var order_ukuran = $("#item_ukuran").val();
		var order_notes = $("#item_notes").val();
		var min_order = $("#item_min_order").val();
		var order_category = $("#item_category");
		
		// alert(customer_id+"<br/>"+order_prod_id+"<br/>"+order_color_id+"<br/>"+order_qty+"<br/>"+order_price);
		
		var order_qty = parseFloat(order_qty);
		var min_order = parseFloat(min_order);
		
		if(order_qty != '')
		{
			if(order_qty >= min_order)
			{
				if(order_variant_id != '')
				{
				
					$.post(base_url+"/process_order_item", {token: token, customer_id: customer_id, prod_id: order_prod_id, ukuran: order_ukuran, variant_id: order_variant_id, price: order_price, qty: order_qty, notes: order_notes},
					   function(data){
						
						/* check */
						if(data.status == 'Invalid Token')
						{
							check_token();
						}
					
						if(data.status == 'OFF')
						{
							check_status_aplikasi(data.message);
						}
						if(data.status == 'Member Not Found')
						{
							check_status_member_not_found();
						}
						if(data.status == 'Member Not Active')
						{
							check_status_member();
						}
						/* end check */
						
						if(data.status == 'Success')
						{
							if(data.product_type == 'Ready Stock')
							{
								alert("Produk telah dipesan");
								get_list_product_ready(order_category_id);
							}
							else
							{
								alert("Produk telah dipesan");
								get_list_product_po(order_category_id);
							}
							
						}
						else
						{
							alert(data.message);
							$.mobile.loading( "hide" );
						}
						
					}, "json");
				}
				else
				{
					window.location = "#page_detail";
					alert("Pilih warna / variant dahulu!");
					$.mobile.loading( "hide" );
					
				}	
			}
			else
			{
				window.location = "#page_detail";
				alert("Minimal order : "+min_order);
				$.mobile.loading( "hide" );
			}
			
		}
		else
		{
			window.location = "#page_detail";
			alert("Masukkan jumlah pesanan!");
			 $.mobile.loading( "hide" );
		}
			
	});	
	
	// MY ORDER 
	$( document ).on( "click", ".menu_page_myorder", function() {
		
		var customer_id = $(".customer_id").html();
		
		$(".total_amount").html("");
		$(".total_qty").html("");
		$(".total_weight").html("");
		
		$.post(base_url+"/list_order", {token: token, customer_id: customer_id},
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#listing_order").html("");
			var order_item = data.order;
			
			if(data.total_qty > 0)
			{
				for(var i=0;i < order_item.length;i++)
				{
					$("#listing_order").append("<label><input name='checkbox-0' type='checkbox' value='"+order_item[i].order_item_id+"'>"+order_item[i].prod_name+" - "+order_item[i].variant+" - ("+order_item[i].qty+")</label>");
				}
			}
			else
			{
				$("#listing_order").html("<center>No Data</center>");
			}	
			
			var total_amount_order = numeral(data.total_amount).format('0.00');
			
			$(".total_amount").html(total_amount_order);
			$(".total_qty").html(data.total_qty);
			$(".total_weight").html(data.total_weight);
			$("#dropship1_tipe").val("Ready Stock");
			$("#dropship2_tipe").val("Ready Stock");
			
		}, "json");
		
		window.location = "#page_myorder";
	});	
	
	
	function get_my_order()
	{
		var customer_id = $(".customer_id").html();
		
		$(".total_amount").html("");
		$(".total_qty").html("");
		$(".total_weight").html("");
		
		$.post(base_url+"/list_order", {token: token, customer_id: customer_id},
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#listing_order").html("");
			var order_item = data.order;
			if(data.total_qty > 0)
			{
				for(var i=0;i < order_item.length;i++)
				{
					$("#listing_order").append("<label><input name='checkbox-0' type='checkbox' value='"+order_item[i].order_item_id+"'>"+order_item[i].prod_name+" - "+order_item[i].variant+" - ("+order_item[i].qty+")</label>");
				}
			}
			else
			{
				$("#listing_order").html("<center>No Data</center>");
			}	
			
			var total_amount_order = numeral(data.total_amount).format('0.00');
			
			$(".total_amount").html(total_amount_order);
			$(".total_qty").html(data.total_qty);
			$(".total_weight").html(data.total_weight);
			$("#dropship1_tipe").val("Ready Stock");
			$("#dropship2_tipe").val("Ready Stock");
			
		}, "json");
		
		window.location = "#page_myorder";
	}
	
	
	// MY DROPSHIP (ALAMAT SENDIRI)
	$( document ).on( "click", ".btn_dropship1", function() {
		
		var customer_id = $(".customer_id").html();
		var order_tipe = $("#dropship1_tipe").val();
		
		var ch = new Array();
		
		 $("#listing_order input:checkbox:checked").each(function() {
		
			 ch.push($(this).val());
			
		});
		
		var post_ch = "["+ch+"]";
		
		if(post_ch != "[]")
		{
			// GET MEMBER DETAIL INFO
			$.post(base_url+"/get_customer_info", {token: token, customer_id:  customer_id},
			   function(data_customer){
			   
			   /* check */
				if(data_customer.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data_customer.status == 'OFF')
				{
					check_status_aplikasi(data_customer.message);
				}
				if(data_customer.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data_customer.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			   
				$("#dropship1_from").val(shop_name);
			   
					 
					// LIST ORDER 
					$.post(base_url+"/get_list_order_item", {token: token, order_item:  post_ch},
					   function(data_item){
					   
					  
						/* check */
						if(data_item.status == 'Invalid Token')
						{
							check_token();
						}
					
						if(data_item.status == 'OFF')
						{
							check_status_aplikasi(data_item.message);
						}
						
						if(data_item.status == 'Member Not Active')
						{
							check_status_member();
						}
						/* end check */
					   
					   $("#listing_dropship1").html("");
					
						var order_item_dropship = data_item.order;
						for(var i=0;i < order_item_dropship.length;i++)
						{
							$("#listing_dropship1").append("<label><input type='hidden' value='"+order_item_dropship[i].order_item_id+"'>"+order_item_dropship[i].prod_name+" - "+order_item_dropship[i].variant+" - ("+order_item_dropship[i].qty+")</label><hr/>");
						}
						
						var total_amount_dropship = numeral(data_item.total_amount).format('0.00');
						
						$(".total_dropship1_amount").html(total_amount_dropship);
						$(".total_dropship1_all").html(total_amount_dropship);
						$(".total_dropship1_qty").html(data_item.total_qty);
						$(".total_dropship1_weight").html(data_item.total_weight);
						
						$("#dropship1_total").val(data_item.total_amount);
						$("#dropship1_weight").val(data_item.total_weight);
						
						$("#dropship1_provinsi").html("<option value='"+data_customer.prov_id+"'>"+data_customer.prov+"</option>");
						$("#dropship1_to").val(data_customer.name);
						$("#dropship1_address").val(data_customer.address);
						$("#dropship1_kota").html("<option value='"+data_customer.kota_id+"'>"+data_customer.kota+"</option>");
						$("#dropship1_phone").val(data_customer.phone);
						$("#dropship1_kodepos").val(data_customer.postcode);
						
						// GET SHIP RATES 
						 $.post(base_url+"/get_ship_rates_cost",{token: token, kota_id: data_customer.kota_id},
							   function(data_cost){
							
								
								 if(data_cost.status == 'Invalid Token')
								{
									check_token();
								}
											
									var data_rates = data_cost.shipping_fee;
									var total_weight = Math.ceil(data_item.total_weight);
									var total_order = data_item.total_amount;
									var total_shipping_cost =  data_rates * total_weight;
									var total_all = parseFloat(total_shipping_cost) + parseFloat(total_order);
									var total_shipping_cost = numeral(total_shipping_cost).format('0.00');
									var total_all = numeral(total_all).format('0.00');
									var total_order = numeral(total_order).format('0.00');
									
									$(".total_dropship1_ongkir").html(total_shipping_cost);
									$(".total_dropship1_all").html(total_all);
									
						}, "json");
						 
					}, "json");
					
			}, "json");
			
			
			window.location = "#page_dropship1";
			$.mobile.loading( "hide" );
		}
		else
		{
			alert("Tidak ada pesanan dipilih");
			$.mobile.loading( "hide" );
		}
       
	});	
	
	// MY DROPSHIP (ALAMAT LAIN)
	$( document ).on( "click", ".btn_dropship2", function() {
		
		var customer_id = $(".customer_id").html();
		
		
		var ch = new Array();
		
		$("#listing_order input:checkbox:checked").each(function() {
		
			 ch.push($(this).val());
			
		});
		
		
		var post_ch = "["+ch+"]";
			
		if(post_ch != "[]")
		{
			
			$.post(base_url+"/get_list_order_item", { token: token, order_item:  post_ch},
			   function(data){
			   
			   /* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			   
			   $("#listing_dropship2").html("");
			
				var order_item_dropship = data.order;
				for(var i=0;i < order_item_dropship.length;i++)
				{
					$("#listing_dropship2").append("<label><input type='hidden' value='"+order_item_dropship[i].order_item_id+"'>"+order_item_dropship[i].prod_name+" - "+order_item_dropship[i].variant+" - ("+order_item_dropship[i].qty+")</label>");
				}
				
				var total_amount_dropship = numeral(data.total_amount).format('0.00');
				
				$(".total_dropship2_amount").html(total_amount_dropship);
				$(".total_dropship2_all").html(total_amount_dropship);
				$(".total_dropship2_qty").html(data.total_qty);
				$(".total_dropship2_weight").html(data.total_weight);
				$(".total_dropship2_ongkir").html("");
				
				$("#dropship2_from").val("");
				$("#dropship2_to").val("");
				
				$("#dropship2_kota").html("<option value=''>- PILIH KOTA -</option>");
				
				$("#dropship2_total").val(data.total_amount);
				$("#dropship2_weight").val(data.total_weight);
				  
			}, "json");
			
			// GET SHIP RATES
			$.post(base_url+"/get_ship_rates_prov",{token: token}, 
			   function(data_prov){
					
					/* check */
					if(data_prov.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data_prov.status == 'OFF')
					{
						check_status_aplikasi(data_prov.message);
					}
					if(data_prov.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data_prov.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */
				
					$("#dropship2_provinsi").html("<option value=''>- PILIH PROVINSI -</option>");
					var listing_prov = data_prov.list;
					
					for(var a=0;a < listing_prov.length;a++)
					{
						var x = "<option value='"+listing_prov[a].id+"'>"+listing_prov[a].nama+"</option>";
						$("#dropship2_provinsi").append(x);
					}

			}, "json");
			
			window.location = "#page_dropship2";
			$.mobile.loading( "hide" );
		}
		else
		{
			alert("Tidak ada pesanan dipilih");
			$.mobile.loading( "hide" );
		}	
			
       
	});	
	
	$( document ).on( "change", "#dropship2_provinsi", function() {
	
		$.mobile.loading( "show" );
		
		var customer_id = $(".customer_id").html();
		var prov_id = $(this).val();
		
		var total_amount = $(".total_dropship2_amount").html();
		$(".total_dropship2_ongkir").html("");
		$(".total_dropship2_all").html(total_amount);
		
		if(prov_id != "")
		{
			$("#dropship2_kota").removeAttr("disabled");
			
			$.post(base_url+"/get_ship_rates_city",{token: token, prov_id:  prov_id},
			   function(data_city){
			
				/* check */
				if(data_city.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data_city.status == 'OFF')
				{
					check_status_aplikasi(data_city.message);
				}
				if(data_city.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data_city.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			
				var listing_city = data_city.list;
					
					$("#dropship2_kota").html("");
					$("#dropship2_kota").html("<option value=''>- PILIH KOTA -</option>");
					for(var a=0;a < listing_city.length;a++)
					{
						var x = "<option value='"+listing_city[a].id+"'>"+listing_city[a].nama+"</option>";
						$("#dropship2_kota").append(x);
					}
					
					$.mobile.loading( "hide" );
					
			}, "json");
		
		}
		else
		{
			$("#dropship2_kota").attr("disabled","disabled");
			$("#dropship2_kota").html("<option value=''>- PILIH KOTA -</option>");
			
			$.mobile.loading( "hide" );
		}
	});	
	
	$( document ).on( "change", "#dropship2_kota", function() {
	
		var customer_id = $(".customer_id").html();
		var kota_id = $(this).val();
		
		if(kota_id != "")
		{
			
			$.post(base_url+"/get_ship_rates_cost",{ token: token, kota_id:  kota_id},
			   function(data_cost){
			
				/* check */
				if(data_cost.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data_cost.status == 'OFF')
				{
					check_status_aplikasi(data_cost.message);
				}
				if(data_cost.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data_cost.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			
				var data_rates = data_cost.shipping_fee;
					var total_weight = $(".total_dropship2_weight").html();
					var total_weight = Math.ceil(total_weight);
					var total_order = $("#dropship2_total").val();
					var total_shipping_cost =  data_rates * total_weight;
					var total_all = parseFloat(total_shipping_cost) + parseFloat(total_order);
					var total_shipping_cost = numeral(total_shipping_cost).format('0.00');
					var total_all = numeral(total_all).format('0.00');
					var total_order = numeral(total_order).format('0.00');
					
					$(".total_dropship2_ongkir").html(total_shipping_cost);
					$(".total_dropship2_all").html(total_all);
					
			}, "json");
		
		}
		else
		{
			$(".total_dropship2_ongkir").html("");
			$(".total_dropship2_all").html(total_order);
		}
	});	
	
	// MY DROPSHIP ALAMAT SENDIRI
	$( document ).on( "click", ".btn_process_dropship1", function() {
		
		var customer_id = $(".customer_id").html();
		var dropship_from = $("#dropship1_from").val();
		var dropship_to = $("#dropship1_to").val();
		var dropship_address = $("#dropship1_address").val();
		var dropship_phone = $("#dropship1_phone").val();
		var dropship_kodepos = $("#dropship1_kodepos").val();
		var dropship_prov = $("#dropship1_provinsi").val();
		var dropship_kota = $("#dropship1_kota").val();
		var dropship_weight = $("#dropship1_weight").val();
		var dropship_total = $("#dropship1_total").val();
		var dropship_ongkir =  $(".total_dropship1_ongkir").html();
		var dropship_total_all = $(".total_dropship1_all").html();
		var order_tipe = $("#dropship1_tipe").val();
		
		var list_dropship = new Array();
		
		 $("#listing_dropship1 input:hidden").each(function() {
		
			 list_dropship.push($(this).val());
			
		});
		
		var post_list_dropship = "["+list_dropship+"]";
		
		if(dropship_from == "")
		{
			alert("Data 'Pengirim' belum diisi");
			$.mobile.loading( "hide" );
		}
		else 
		if(dropship_to == "")
		{
			alert("Data 'Tujuan' belum diisi");
			$.mobile.loading( "hide" );
		}
		else
		if(dropship_prov == "")
		{
			alert("Data 'Provinsi' belum dipilih");
			$.mobile.loading( "hide" );
		}
		else
		if(dropship_kota == "")
		{
			alert("Data 'Kota' belum dipilih");
			$.mobile.loading( "hide" );
		}
		else
		{
		
			$.post(base_url+"/process_dropship", {token: token, customer_id: customer_id,from: dropship_from ,to: dropship_to, prov_id: dropship_prov, kota_id: dropship_kota, address_recipient: dropship_address, phone_recipient:dropship_phone , postal_code:dropship_kodepos, ongkir: dropship_ongkir, total: dropship_total_all, weight: dropship_weight, order_item_id:  post_list_dropship},
			   function(data){
			   
			   /* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			   
			   alert("Data telah dikirim!");
			   
				$("#dropship1_from").val('');
				$("#dropship1_to").val('');
				$("#dropship1_ongkir").val('');
			   
			   get_my_order();
			   
			}, "json");
		}	
       
	});	
	
	
	// MY DROPSHIP ALAMAT LAIN
	$( document ).on( "click", ".btn_process_dropship2", function() {
		
		var customer_id = $(".customer_id").html();
		var dropship_from = $("#dropship2_from").val();
		var dropship_to = $("#dropship2_to").val();
		var dropship_address = $("#dropship2_address").val();
		var dropship_phone = $("#dropship2_phone").val();
		var dropship_kodepos = $("#dropship2_kodepos").val();
		var dropship_prov = $("#dropship2_provinsi").val();
		var dropship_kota = $("#dropship2_kota").val();
		var dropship_weight = $("#dropship2_weight").val();
		var dropship_total = $("#dropship2_total").val();
		var dropship_ongkir =  $(".total_dropship2_ongkir").html();
		var dropship_total_all = $(".total_dropship2_all").html();
		var order_tipe = $("#dropship2_tipe").val();
		
		var list_dropship = new Array();
		
		 $("#listing_dropship2 input:hidden").each(function() {
		
			 list_dropship.push($(this).val());
		});
		
		var post_list_dropship = "["+list_dropship+"]";
		
		if(dropship_from == "")
		{
			alert("Data 'Pengirim' belum diisi");
			$.mobile.loading( "hide" );
		}
		else 
		if(dropship_to == "")
		{
			alert("Data 'Tujuan' belum diisi");
			$.mobile.loading( "hide" );
		}
		else
		if(dropship_prov == "")
		{
			alert("Data 'Provinsi' belum dipilih");
			$.mobile.loading( "hide" );
		}
		else
		if(dropship_kota == "")
		{
			alert("Data 'Kota' belum dipilih");
			$.mobile.loading( "hide" );
		}
		else
		{
			$.post(base_url+"/process_dropship", {token: token, customer_id: customer_id,from: dropship_from ,to: dropship_to, address_recipient: dropship_address, phone_recipient:dropship_phone, postal_code:dropship_kodepos ,prov_id: dropship_prov, kota_id: dropship_kota , ongkir: dropship_ongkir, total: dropship_total_all, weight: dropship_weight, order_item_id:  post_list_dropship, tipe: order_tipe},
			   function(data){
			   
			   /* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			   
			   alert("Data telah dikirim!");
			   
				$("#dropship_from").val('');
				$("#dropship_to").val('');
				$("#dropship_ongkir").val('');
			   
			   get_my_order();
			   
			}, "json");
		}	
       
	});	
	
	
	// DATA PESANAN LIST
	
		$( document ).on( "click", ".menu_page_pesanan_list", function() {
				var customer_id = $(".customer_id").html();
				var order_payment = $(this).attr("title");
				var page = $(this).attr("rel");
				var page = parseInt(page);
				var prev_page = page - 1;
				var next_page = page + 1;
					
				$.post(base_url+"/get_data_order",{token: token, customer_id: customer_id, page: page, order_payment: order_payment},
				 
				   function(data){

				   /* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */
				   
					if(data.status == 'Success')
				   {
						var order_list = data.list;
						var order_list_length = order_list.length;
						
						for(var i = 0; i < 10; i++)  
						{	
							
							var listing = "#content_list_data_order #list_"+i;
							
							if(i < order_list_length)
							{	
								$(listing).show();
								$(listing+" a").attr("rel",order_list[i].order_id);
								$(listing+" a").html("ID Pesanan : #"+order_list[i].order_id+"<br/>Total : Rp."+numeral(order_list[i].total).format('0.00'));
							}
							else
							{
								$(listing).hide();
							}
						}
						
						$("#page_data_order_prev").attr("rel",prev_page);
						$("#page_data_order_prev").attr("title",order_payment);
						$("#page_data_order_current").html(page);
						$("#page_data_order_next").attr("rel",next_page);
						$("#page_data_order_next").attr("title",order_payment);
						
						window.location = "#page_data_order_list";
						
					}
					else
					{		
						alert("Tidak ada data");
						$.mobile.loading( "hide" );
						return false;
					}	
	
				}, "json");	
				return false;
		});
		
		
	
	
	// GET DATA PESANAN DETAIL
	$( document ).on( "click", ".menu_page_pesanan_detail", function() {
		var customer_id = $(".customer_id").html();
		var order_id = $(this).attr("rel");
		
		$(".order_detail_id_pesanan").html("");
		$(".order_detail_tanggal_order").html("");
		$(".order_detail_jenis_order").html("");
		$(".order_detail_status_pembayaran").html("");
		$(".order_detail_from").html("");
		$(".order_detail_to").html("");
		$(".order_detail_kota").html("");
		$(".order_detail_provinsi").html("");
		$(".order_detail_item_pesanan").html("");
		$(".order_detail_shipping_fee").html("");
		$(".order_detail_shipping_status").html("");
		$(".order_detail_resi").html("");
		$(".order_detail_total").html("");
	
		$.post(base_url+"/get_data_order_detail", {token: token, order_id: order_id, customer_id: customer_id},
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$(".order_detail_id_pesanan").html(data.order_id);
			$(".order_detail_tanggal_order").html(data.order_datetime);
			$(".order_detail_jenis_order").html(data.order_status);
			$(".order_detail_status_pembayaran").html(data.order_payment);
			$(".order_detail_from").html(data.shipping_from);
			$(".order_detail_to").html(data.shipping_to);
			$(".order_detail_kota").html(data.kota);
			$(".order_detail_provinsi").html(data.provinsi);
			$(".order_detail_shipping_status").html(data.shipping_status);
			$(".order_detail_resi").html(data.resi);
			
			for(var i=0; i<data.orders_item.length ; i++)
			{
				$(".order_detail_item_pesanan").append("- "+data.orders_item[i].name_item+" "+data.orders_item[i].variant_name+" | SUB: Rp."+numeral(data.orders_item[i].subtotal).format('0.00')+"<br/>");
			}
			
			$(".order_detail_shipping_fee").html("Rp."+numeral(data.shipping_fee).format('0.00'));
			$(".order_detail_total").html("Rp."+numeral(data.total).format('0.00'));
		
			window.location = "#page_data_order_detail";
			
		}, "json");
		
	});	
	
	// CONFIRM 
	$( document ).on( "click", ".menu_page_confirm", function() {
		var customer_id = $(".customer_id").html();
		$.post(base_url+"/get_data_order_unpaid",{token: token, customer_id: customer_id},
		   function(data){
		   
		   $("#confirm_nama").val("");
			$("#confirm_bank").val("");
			$("#confirm_jumlah").val("");
			$("#confirm_rekening").val("");
		   
		  /* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
				
		   $("#confirmation_data_order").html("<option value=''>- Nomor Pesanan -</option>");
		   
		   if(data.status == 'Success')
		   {
				for(var i=0; i<data.list.length; i++)
				{
					$("#confirmation_data_order").append("<option value='"+data.list[i].order_id+"'>#"+data.list[i].order_id+" - Rp."+numeral(data.list[i].total).format('0.00'));
				}
		
		   }
		   else
		   {
				$("#confirmation_data_order").html("<option value=''>- Tidak ada pesanan belum Lunas -</option>");
		   }
		   	window.location = "#page_confirm";
			
		}, "json");
	
	});
	
	$( document ).on( "click", ".btn_confirm_payment", function() {
		
		var customer_id = $(".customer_id").html();
		var order_id = $("#confirmation_data_order").val();
		var confirm_nama = $("#confirm_nama").val();
		var confirm_bank =  $("#confirm_bank").val();
		var confirm_jumlah = $("#confirm_jumlah").val();
		var confirm_rekening = $("#confirm_rekening").val();
		
		//Validasi
		if(order_id == "")
		{
			alert("Data 'Nomor Pesanan' belum diisi");
		}
		else
		if(confirm_nama == "")
		{
			alert("Data 'Nama' belum diisi");
		}
		else
		if(confirm_bank == "")
		{
			alert("Data 'Bank' belum diisi");
		}
		else
		if(confirm_jumlah == "")
		{
			alert("Data 'Jumlah' belum diiisi");
		}
		else
		if(confirm_rekening == "")
		{
			alert("Data 'Rekening' belum diisi");
		}
		else
		{
			$.post(base_url+"/confirm_payment",{ token: token, order_id: order_id, nama: confirm_nama, bank: confirm_bank, jumlah: confirm_jumlah, rekening: confirm_rekening, customer_id: customer_id},
			   function(data){
				
				/* check */
				if(data.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data.status == 'OFF')
				{
					check_status_aplikasi(data.message);
				}
				if(data.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
				
				$("#confirm_nama").val("");
				$("#confirm_bank").val("");
				$("#confirm_jumlah").val("");
				$("#confirm_rekening").val("");
				
				alert("Data Konfirmasi Pembayaran telah Dikirim");
				window.location = "#page_dashboard";
				
			}, "json");
		}	
		
	});	


	// MESSAGES LIST
	
	$(document).on('pageinit',function(event){
		$( document ).on( "click", ".menu_page_message", function() {
				var customer_id = $(".customer_id").html();
				var page = $(this).attr("rel");
				var page = parseInt(page);
				var prev_page = page - 1;
				var next_page = page + 1;
					
				$.post(base_url+"/get_list_message",{token: token, customer_id: customer_id, page: page },
				 
				   function(data){

					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */	

					if(data.status == 'Not_found')
					{
						$("#message_notif").html("<center>Data tidak ada</center>");
						$(".menu_page_message_detail").hide();	
						$("#page_message_current").html("1");
						
						window.location = "#page_message";
						
					}
					else
					if(data.status == 'Success')
				   {
						var messages = data.message;
						var messages_length = messages.length;
						
						for(var i = 0; i < 10; i++)  
						{	
							
							var listing = "#content_list_message #list_"+i;
							
							if(i < messages_length)
							{	
								$(listing).show();
								$(listing+" a").attr("rel",messages[i].id);
								$(listing+" a").html(messages[i].subject);
							}
							else
							{
								$(listing).hide();
							}
						}
						
						$("#page_message_prev").attr("rel",prev_page);
						$("#page_message_current").html(page);
						$("#page_message_next").attr("rel",next_page);
						
						window.location = "#page_message";
						
					}
					else
					{		
						get_list_message(prev_page);
					}	
	
				}, "json");	
		});
	});
	
	// GET MESSAGE DETAIL PAGE
	$( document ).on( "click", ".menu_page_message_detail", function() {
		
		var customer_id = $(".customer_id").html();
		var message_id = $(this).attr("rel");
			
		$.post(base_url+"/get_detail_message", {token: token, message_id: message_id, customer_id: customer_id},
		   function(data){
			
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#message_detail_subject").html(data.subject);
			$("#message_detail_content").html(data.content);
			
			window.location = "#page_message_detail";
			
		}, "json");
		
	});	
	

	// INFO 
	$( document ).on( "click", ".menu_page_info", function() {
		
		var customer_id = $(".customer_id").html();
		
		$.post(base_url+"/get_info",{token: token, customer_id: customer_id},
		   function(data){
		   
		   /* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			$("#info_informasi").html("");
			$("#info_kontak").html("");
			$("#info_rekening").html("");
			$("#info_informasi").html(data.info);
			$("#info_kontak").html(data.kontak);
			$("#info_rekening").html(data.rekening);
			
		}, "json");
		
		window.location = "#page_info";
	});	
	
	
	// PENGATURAN
	$( document ).on( "click", ".menu_page_setting", function() {
		var customer_id = $(".customer_id").html();
		$.post(base_url+"/get_customer_info",{token: token, customer_id: customer_id },
			   function(data){
					
					/* check */
					if(data.status == 'Invalid Token')
					{
						check_token();
					}
				
					if(data.status == 'OFF')
					{
						check_status_aplikasi(data.message);
					}
					if(data.status == 'Member Not Found')
					{
						check_status_member_not_found();
					}
					if(data.status == 'Member Not Active')
					{
						check_status_member();
					}
					/* end check */
					
					$("#update_name").val(data.name);
					$("#update_email").val(data.email);
					$("#update_phone").val(data.phone);
					$("#update_alamat").val(data.address);
					$("#update_kodepos").val(data.postcode);
					$("#update_pinbb").val(data.pin_bb);
					
					window.location = "#page_settings_profile";
					
		}, "json");
	});	
	
	$( document ).on( "click", ".btn_update_setting", function() {
		
		var customer_id = $(".customer_id").html();
		var update_name = $("#update_name").val();
		var update_email = $("#update_email").val();
		var update_phone =  $("#update_phone").val();
		var update_password = $("#update_password").val();
		var update_alamat = $("#update_alamat").val();
		var update_kodepos = $("#update_kodepos").val();
		var update_pinbb = $("#update_pinbb").val();
		
		$.post(base_url+"/update_settings",{token: token, nama: update_name, email: update_email, phone: update_phone, password: update_password, alamat: update_alamat, kodepos: update_kodepos,pinbb: update_pinbb, customer_id: customer_id},
		   function(data){
		   
			/* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
		   
		    $.post(base_url+"/get_customer_info",{token: token, customer_id: customer_id},
		    function(data_customer){
			
				/* check */
				if(data_customer.status == 'Invalid Token')
				{
					check_token();
				}
			
				if(data_customer.status == 'OFF')
				{
					check_status_aplikasi(data_customer.message);
				}
				if(data_customer.status == 'Member Not Found')
				{
					check_status_member_not_found();
				}
				if(data_customer.status == 'Member Not Active')
				{
					check_status_member();
				}
				/* end check */
			
				$("#update_name").val(data_customer.name);
				$("#update_email").val(data_customer.email);
				$("#update_phone").val(data_customer.phone);
				$("#update_password").val("");
				$("#update_password_confirm").val("");
				$("#update_alamat").val(data_customer.address);
				$("#update_kodepos").val(data_customer.postcode);
				$("#update_pinbb").val(data_customer.pin_bb);
			
			}, "json");
			
			$("#setting_message").html("<div class='alert-success'>Update Setting Successfull</div>");
			window.location = "#page_settings_profile";
			
		}, "json");
		
		$.mobile.loading( "hide" );
		
	});	
	
	// UPDATE 
	$( document ).on( "click", "#get_update", function() {
		
		var customer_id = $(".customer_id").html();
		
		$.post(base_url+"/get_update_apps",{token: token, customer_id: customer_id},
		   function(data){
		   
		   /* check */
			if(data.status == 'Invalid Token')
			{
				check_token();
			}
		
			if(data.status == 'OFF')
			{
				check_status_aplikasi(data.message);
			}
			if(data.status == 'Member Not Found')
			{
				check_status_member_not_found();
			}
			if(data.status == 'Member Not Active')
			{
				check_status_member();
			}
			/* end check */
			
			window.open(data.link,'_system','location=yes');
			
		}, "json");
		
		
	});	
	
	// LOGOUT 
	$( document ).on( "click", ".menu_page_logout", function() {
	
		var logout_confirm = confirm("Anda ingin Logout dari Akun Toko?");
		
		if(logout_confirm == true)
		{
			localStorage.removeItem('Login');
			localStorage.removeItem('Customer_id');
			localStorage.removeItem('Customer_name');
			localStorage.removeItem('Customer_email');
			window.location = "#page_login";
		}
		else
		{
			window.location = "#pege_settings";
		}
		
		$.mobile.loading( "hide" );
		
	});	

	function redirect_page_login(login_status)
	{
		window.location = "#page_loading";
		$("#info-login-status").html(login_status.status);
	}

	
	//SAVE IMAGE DETAIL
	// SAVE IMAGES //
	function download(file_img, Folder_Name, base_download_url) {
	//step to request a file system 
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

		function fileSystemSuccess(fileSystem) {
			var download_link = encodeURI(base_download_url+"download_img.php?file_img="+file_img);
			ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

			var directoryEntry = fileSystem.root; // to get root path of directory
			directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
			var rootdir = fileSystem.root;
			var fp = rootdir.toURL(); // Returns Fulpath of local directory

			fp = fp + "/" + Folder_Name + "/" + file_img; // fullpath and name of the file which we want to give
			// download function call
			filetransfer(download_link, fp);
		}

		function onDirectorySuccess(parent) {
			// Directory created successfuly
		}

		function onDirectoryFail(error) {
			//Error while creating directory
			alert("Unable to create new directory: " + error.code);
		}

		function fileSystemFail(evt) {
			//Unable to access file system
			alert(evt.target.error.code);
		 }
	}
	
	function filetransfer(download_link, fp) {
	var fileTransfer = new FileTransfer();
	// File download function with URL and local path
	
	fileTransfer.download(
			download_link,
			fp,
			function(entry) {
				alert("Gambar berhasil disimpan");
				console.log("download complete: " + entry.toURL());
				$.mobile.loading( "hide" );
			},
			function(error) {
				alert("Penyimpanan gambar gagal: Error Code = " + error.code);
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code" + error.code);
				$.mobile.loading( "hide" );
			},
			false,
			{
				headers: {
					"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
				}
			}
		);
	}
	// END ALTERNATIVE //
	
	// Exit 
	function onLoad() {
                document.addEventListener('deviceready', deviceReady, false);
            }

            function deviceReady() {
                document.addEventListener('backbutton', backButtonCallback, false);
            }

             function backButtonCallback() {
				navigator.notification.confirm('Keluar dari aplikasi?',confirmCallback);
             }
             function confirmCallback(buttonIndex) {
                if(buttonIndex == 1) {
                 navigator.app.exitApp();
            return true;
            }
            else {
            return false;
        }
   }
	
	
