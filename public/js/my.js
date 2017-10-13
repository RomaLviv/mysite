const app = angular.module('app', ['ngRoute','ngDialog']);

app.controller("myCtrl", function ($scope, $http) {});

app.directive('loginBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/login.html',
        controller: function ($scope, $http, ngDialog) {
            $scope.forget = function () {
                ngDialog.open({
                    template: '/template/forget.html',
                    className: 'ngdialog-theme-default'
                });
            };
            $scope.logOut = function () {
                let logoutObj = {
                    login: localStorage.userName
                };
				$scope.lout = false;
                $http.post('http://localhost:8000/logout', logoutObj)
                    .then(function successCallback(response) {
					alert("Good by!")
                        console.log("Good by!")
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                $scope.newUser = true;
                $scope.enterLogin = false;
                localStorage.userName = "Guest";
            };
            if (localStorage.userName == undefined) {
                localStorage.userName = "Guest";
            } else {
                if (localStorage.userName != "Guest") {
                    $scope.userIn = "Wellcome " + localStorage.userName;
                    $scope.newUser = false;
                    $scope.enterLogin = true;
                    $scope.user = "";
                   $scope.lout = true;
                } else {
                    $scope.newUser = true;
                    $scope.enterLogin = false;
                }
				//Права доступу
				if (localStorage.userName == "admin") {
						$scope.regedit = true;
					}else {
//							alert("У вас обмежений доступ");
						$scope.regedit = false;
                        };
            };
            $scope.check = function () {
                let loginObj = {
                    login: $scope.login,
                    pass: $scope.password
                };
				$scope.lout = false;
                $http.post('http://localhost:8000/login-auth', loginObj)
                    .then(function successCallback(response) {
                        if (response.data == "welcome") {
                            $scope.userIn = "Wellcome " + $scope.login;
                            $scope.newUser = false;
                            $scope.enterLogin = true;
                            $scope.user = "";
							$scope.lout = true;
                            localStorage.userName = $scope.login;
                        } else {
                            $scope.user = response.data;
							alert("wrong login or password");
                        };
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
            $scope.registr = function () {
                ngDialog.open({
                    template: '/template/registration.html',
                    className: 'ngdialog-theme-default'
                });
            };
			 $scope.space = function () {
                ngDialog.open({
                    template: '/template/space.html',
                    className: 'ngdialog-theme-default'
                });
            };
        }
    }
});
app.directive('forgetBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/forget-block.html',
        controller: function ($scope, $http, ngDialog) {
            $scope.remind = function () {
                let obj = {
                    mail: $scope.remindMail
                };
                $http.post('http://localhost:8000/remind', obj)
                    .then(function successCallback(response) {
                        alert(response.data);
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                ngDialog.closeAll();
            }
        }
    }
});
app.directive('regBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/reg-block.html',
        controller: function ($scope, $http, ngDialog) {
            $scope.registration = function () {
                if ($scope.newVerCode == $scope.code) {
                    let obj2 = {
                        login: $scope.newLogin,
                        password: $scope.newPassword,
                        mail: $scope.newMail,
                        status: "false"
                    };
                    $http.post('http://localhost:8000/login', obj2)
                        .then(function successCallback() {
                            alert("Registered " + $scope.newLogin);
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    ngDialog.closeAll();
                } else {
                    alert("Wrong Verification Code!");
                }
            };
        }
    }
});
app.directive('menuBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/menu.html',
        controller: function ($scope) {
			 $(function(){
  $('.translate').hover(function(){
	 $(".translate").animate({left: "3px"}, 170).animate({left: "-3px"}, 170).animate({left: "3px"}, 170).animate({left: "0px"}, 170);
	  });
 });
	$(function(){
  $('.home').hover(function(){
	 $(".home").animate({left: "3px"}, 150).animate({left: "-3px"}, 150).animate({left: "3px"}, 150).animate({left: "0px"}, 150);
	  });
 });
	$(function(){
  $('.poslygu').hover(function(){
	 $(".poslygu").animate({left: "3px"}, 170).animate({left: "-3px"}, 170).animate({left: "3px"}, 170).animate({left: "0px"}, 170);
	  });
 });
	$(function(){
  $('.kontaktu').hover(function(){
	 $(".kontaktu").animate({left: "3px"}, 150).animate({left: "-3px"}, 150).animate({left: "3px"}, 150).animate({left: "0px"}, 150);
	  });
 });
	$(function(){
  $('.price').hover(function(){
	 $(".price").animate({left: "3px"}, 170).animate({left: "-3px"}, 170).animate({left: "3px"}, 170).animate({left: "0px"}, 170);
	  });
 });
	$(".chatShow").click(function(){
	$(".chatBox").animate({
		left: "0"
	})
})
             $scope.homeStatus = true;
            $scope.contactStatus = false;
            $scope.allItems = true;
            $scope.statusItem = false;
			$scope.contact = false;
			$scope.slider = true;
			$scope.loginBL = true;
			$scope.menu = true;
			$scope.content = true;
			$scope.price = false;
			$scope.allLang = false;
            $scope.choosePrice = function () {
                $scope.content = false;
                $scope.slider = false;
                $scope.menu = false;
                $scope.contact = false;
				$scope.price = true;
//				$scope.field = false;
				$scope.lang = false;
				$scope.allLang = false;
            };
			$scope.chooseLang = function () {
				$scope.content = false;
				$scope.contact = false;
				$scope.allLang = true;
			}
            $scope.chooseMail = function () {
                $scope.mailStatus = true;
                $scope.contactStatus = false;
                $scope.homeStatus = false;
            };
        }
    }
});
app.directive('priceBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/price.html',
        controller: function ($scope) {
        }
    }
});
app.directive('contactBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/contact.html',
        controller: function ($scope) {
        }
    }
});
app.directive('socialBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/social.html',
        controller: function ($scope) {
            $scope.chooseHolovna = function () {
                $scope.content = true;
                $scope.slider = true;
                $scope.menu = true;
                $scope.contact = false;
                $scope.price = false;
				$scope.lang = false;
				$scope.allLang = false;
            };
            $scope.chooseCont = function () {
                $scope.contact = true;
				$scope.menu = false;
				$scope.slider = false;
				$scope.content = false;
				$scope.price = false;
				$scope.lang = false;
				$scope.allLang = false;
            };
            $scope.showLogin = function () {
                $scope.loginBL = false;
				$scope.field = true;
				$scope.logBtn = true;
				$scope.lBtn = false;
				$scope.RBtn = false;
            };
        }
    }
});
app.directive('sliderBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/slider.html',
        controller: function ($scope) {
			$('.viewport').hover(function(){
    clearInterval(sliderTimer);
},function(){
    sliderTimer=setInterval(nextSlide,5000);
});
var slideWidth = 420; 
    var slideTimer; 
    $('.slidewrapper').width($('.slidewrapper').children().length * slideWidth);
    sliderTimer=setInterval(nextSlide,5000);
function nextSlide(){
    var currentSlide=parseInt($('.slidewrapper').data('current'));
    currentSlide++;
    if(currentSlide>=$('.slidewrapper').children().length) 
    {
        currentSlide=0;   
    }
    $('.slidewrapper').animate({left: -currentSlide*slideWidth},420).data('current',currentSlide);
}
    }
}});
app.directive('contentBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/content.html',
        controller: function ($scope) {
    }
}});
app.directive('langBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/lang.html',
        controller: function ($scope, $http, ngDialog) {
            $scope.indexOfItem = "";
            $scope.countChanges = 1;
            $scope.statusImgUpload = false;
			$scope.searchLang = true;
			$scope.regedit= false;
            $http.get('http://localhost:8000/items')
                .then(function successCallback(response) {
                    $scope.myWelcome2 = response.data;
                }, function errorCallback(response) {
                    console.log("Error!!!" + response.err);
                });
            $scope.chooseItem = function (index, name, price, indexArr, itemSrc) {
                let beforeCountChanges = itemSrc.split("-");
                $scope.editItemStatus = false;
                $scope.indexOfItem = index;
                $http.get('http://localhost:8000/items-info')
                    .then(function successCallback(response) {
                        $scope.itemsInfoText = response.data;
                        $scope.allItems = false;
                        $scope.statusItem = true;
					    $scope.searchLang = false;
                        $scope.choosenItemName = name;
                        $scope.choosenItemPrice = price;
                        $scope.choosenItemSrc = itemSrc;
                        $scope.choosenItemText = $scope.itemsInfoText[indexArr];
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                $scope.changeSatusImgUpload = function () {
                    $scope.statusImgUpload = true;
                }
                $scope.editItem = function () {
                    $scope.editItemStatus = true;
                    $scope.newNameOfItem = $scope.choosenItemName;
                    $scope.newPriceOfItem = $scope.choosenItemPrice;
                    $scope.newInfoOfItem = $scope.choosenItemText;
                    $scope.newItemSrc = $scope.choosenItemSrc;
                };
                $scope.deleteItem = function () {
                    $http.delete('http://localhost:8000/item/' + index)
                        .then(function successCallback() {
                            console.log("Deleted!");
                            $scope.itemsInfoText.splice(indexArr, 1);
                            let obj = {
                                text: $scope.itemsInfoText.join('/item/')
                            };
                            $http.put('http://localhost:8000/items-info', obj)
                                .then(function successCallback() {
                                    console.log("Updated text in txt file");
                                    $http.get('http://localhost:8000/items')
                                        .then(function successCallback(response) {
                                            $scope.myWelcome2 = response.data;
                                            $scope.allItems = true;
                                            $scope.statusItem = false;
                                            $scope.choosenItemName = "";
                                            $scope.choosenItemPrice = "";
                                        }, function errorCallback(response) {
                                            console.log("Error!!!" + response.err);
                                        });
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        })
                }
                var newAdrrImg = "";
                $scope.changeItemEdit = function () {
                    if ($scope.statusImgUpload) {
                        var fd = new FormData();
                        if (beforeCountChanges[1] == undefined) {
                            newAdrrImg = itemSrc + "-" + $scope.countChanges
                        } else {
                            $scope.countChanges += Number(beforeCountChanges[1]);
                            newAdrrImg = beforeCountChanges[0] + "-" + $scope.countChanges;
                        }
                        fd.append(newAdrrImg, $scope.myFile);
                        $http.post('http://localhost:8000/images', fd, {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            })
                            .then(function successCallback() {
                                console.log("Uploaded!");
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            })
                    }
                    $scope.itemsInfoText[indexArr] = $scope.newInfoOfItem;
                    let obj = {
                        text: $scope.itemsInfoText.join('/item/')
                    };
                    $http.put('http://localhost:8000/items-info', obj)
                        .then(function successCallback() {
                            console.log("Updated text in txt file");
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    $scope.countChanges += Number(beforeCountChanges[1]);
                    if ($scope.statusImgUpload) {
                        var objEdit = {
                            name: $scope.newNameOfItem,
                            price: $scope.newPriceOfItem,
                            src: newAdrrImg
                        }
                    } else {
                        var objEdit = {
                            name: $scope.newNameOfItem,
                            price: $scope.newPriceOfItem,
                            src: itemSrc
                        }
                    }
                    $http.post('http://localhost:8000/item-edit/' + $scope.indexOfItem, objEdit)
                        .then(function successCallback() {
                            console.log("Edited");
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    $http.get('http://localhost:8000/items')
                        .then(function successCallback(response) {
                            $scope.myWelcome2 = response.data;
                            $scope.choosenItemName = $scope.newNameOfItem;
                            $scope.choosenItemPrice = $scope.newPriceOfItem;
                            $scope.choosenItemText = $scope.newInfoOfItem;
                            if ($scope.statusImgUpload) {
                                $scope.choosenItemSrc = newAdrrImg;
                            } else {
                                $scope.choosenItemSrc = itemSrc;
                            };
                            $scope.statusImgUpload = false;
                            $scope.editItemStatus = false;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                }
            };
            $scope.backToAllItems = function () {
                $scope.allItems = true;
                $scope.statusItem = false;
                $scope.choosenItemName = "";
                $scope.choosenItemPrice = "";
				$scope.searchLang = true;
            };
            $scope.addItemStatus = false;
            $scope.addItem = function () {
                $scope.addItemStatus = true;
                $scope.allItems = false;
            };
            $scope.backFromAddItem = function () {
                $http.get('http://localhost:8000/items')
                    .then(function successCallback(response) {
                        $scope.myWelcome2 = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                $scope.addItemStatus = false;
                $scope.allItems = true;
            };
            $scope.pagArr = [1, 2, 3]
            $scope.myWelcome2
        },
        link: function (scope, element, attrs) {
            scope.itemName = "";
            scope.itemPrice = "";
            scope.choosenItemName = "";
            scope.choosenItemPrice = "";
            scope.choosenItemText = "";
            scope.items = [{
                name: scope.itemName,
                price: scope.itemPrice
            }];
        }
    }
});
app.directive('addLangBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/addLang.html',
        controller: function ($scope, $http) {
            $scope.nameOfNewItem = "";
            $scope.priceOfNewItem = "";
            $scope.aboutNewItem = "";
            $scope.addNewItem = function () {
                var imgNumberName = 0;
                if ($scope.myWelcome2[0] == undefined) {
                    imgNumberName = 1;
                } else {
                    imgNumberName = $scope.myWelcome2[$scope.myWelcome2.length - 1].id + 1;
                };
                var fd = new FormData();
                fd.append(imgNumberName, $scope.myFile);
                $http.post('http://localhost:8000/images', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then(function successCallback() {
                        console.log("Uploaded!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                let obj = {
                    text: $scope.aboutNewItem
                };
                $http.post('http://localhost:8000/items-info', obj)
                    .then(function successCallback() {
                        console.log("Text in txt file");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                let obj2 = {
                    name: $scope.nameOfNewItem,
                    price: $scope.priceOfNewItem,
                    src: imgNumberName
                };
                $http.post('http://localhost:8000/items', obj2)
                    .then(function successCallback() {
                        console.log("Data in DB");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                $http.get('http://localhost:8000/items')
                    .then(function successCallback(response) {
                        $scope.myWelcome2 = response.data;
                        $scope.addItemStatus = false;
                        $scope.allItems = true;
                        $scope.nameOfNewItem = "";
                        $scope.priceOfNewItem = "";
                        $scope.aboutNewItem = "";
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            }
        }
    }
});
app.directive('mailBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/mail.html',
        controller: function ($scope, $http) {
            $scope.send = function () {
                let obj = [{
                    name: $scope.myText,
                    words: $scope.myWords,
					info: $scope.myInfo
                }];
				  var fd = new FormData();
        fd.append("test", $scope.myFile);
        $http.post('http://localhost:8000/images', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function successCallback() {
                console.log("Uploaded!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            })
                $http.post('http://localhost:8000/send-mail', obj)
                    .then(function successCallback() {
                        console.log("Sent!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            }
        }
    }
});
app.directive('spaceBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/space-block.html',
        controller: function ($scope, $http, ngDialog) {
        }
    }
});
app.directive('menuminBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/menumin.html',
        controller: function ($scope, $http) {
        }
    }
});
app.directive('chatBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/chat.html',
        link: function (scope, element, attrs) {
            function initMap() {
                var uluru = {
                    lat: -25.363,
                    lng: 131.044
                };
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 4,
                    center: uluru
                });
                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
            }
			$(function () {
        var socket = io();
        $('.cht').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
			$('#messages').append($('<p>').text(localStorage.userName));
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
			$(".hide").click(function(){
	$(".chatBox").animate({
		left: "-500px"
	})
	
})
            scope.textField = "";
            scope.nameField = localStorage.userName;
            scope.EnterProfile = function () {
            scope.nameField = scope.Name;
            };
            scope.textiki = [];
            scope.EnterText = function () {
                scope.date = new Date();
                scope.textiki.push({
                    date: scope.date,
                    nameField: scope.nameField,
                    textField: scope.textField
                });
                scope.textField = "";
            }
        }
    }
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
