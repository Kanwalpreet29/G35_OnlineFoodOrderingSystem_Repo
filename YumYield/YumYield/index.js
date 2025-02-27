let food = [];
let totalAmount = 0;

$(document).ready(function () {
  // Adjust navbar alignment for smaller screens
  if ($(document).width() <= 992) {
    $(".navbar-nav").removeClass("ml-auto");
    $(".navbar-nav").addClass("mr-auto");
  } else {
    $(".navbar-nav").removeClass("mr-auto");
    $(".navbar-nav").addClass("ml-auto");
  }

  // Scroll to top button functionality
  var scrollToTopBtn = $("#scrollToTop");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.addClass("show");
    } else {
      scrollToTopBtn.removeClass("show");
    }
  });

  scrollToTopBtn.on("click", function (event) {
    event.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      "500"
    );
  });

  // Smooth scrolling for navbar links
  $(".navbar a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });

  // Smooth scrolling for home button
  $(".homeBtn").click(function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      let hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });

  // Handle category clicks
  $(".product-box-layout4").click(function () {
    // Remove 'productClicked' class from all other categories
    $(this)
      .toggleClass("productClicked")
      .parent()
      .siblings("div")
      .children()
      .removeClass("productClicked");

    // Hide all product sections first
    $("#momos, #chinese, #beverages, #pinnos, #venkys, #golzaa").hide();

    // Show the clicked product section
    if ($(this)[0].className.search("momos productClicked") > -1) {
      $("#momos").show();
    } else if ($(this)[0].className.search("chinese productClicked") > -1) {
      $("#chinese").show();
    } else if ($(this)[0].className.search("beverages productClicked") > -1) {
      $("#beverages").show();
    } else if ($(this)[0].className.search("pinnos productClicked") > -1) {
      $("#pinnos").show();
    } else if ($(this)[0].className.search("venkys productClicked") > -1) {
      $("#venkys").show();
    } else if ($(this)[0].className.search("golzaa productClicked") > -1) {
      $("#golzaa").show();
    }

    // Scroll to the opened section
    $("html, body").animate(
      {
        scrollTop: $(this.hash).offset().top,
      },
      800
    );
  });

  // Handle plus/minus button clicks for adding items to the cart
  $(".menuBtn").click(function () {
    let quantity = $(this).siblings(".quantity");
    let foodNameClicked = quantity
      .parent()
      .siblings("div")
      .children()
      .first()
      .text()
      .trim();
    let singleFoodAmount = quantity.parent().siblings("div").children().last().text();
    let numericPart = singleFoodAmount.replace(/[^\d.]/g, "");
    if (!isNaN(numericPart)) {
      singleFoodAmount = parseFloat(numericPart);
    }
    let isVeg = quantity
      .parent()
      .siblings("div")
      .children()
      .first()
      .children()
      .first()
      .children()
      .hasClass("vegIcon");

    let count = Number(quantity.text());
    if ($(this)[0].className.search("plus") > -1) {
      count = count + 1;
      quantity.text(count);
      ToCart(foodNameClicked, count, isVeg, singleFoodAmount);
    } else if ($(this)[0].className.search("minus") > -1) {
      if (count <= 0) {
        quantity.text(0);
      } else {
        count = count - 1;
        quantity.text(count);
        ToCart(foodNameClicked, count, isVeg, singleFoodAmount);
      }
    }
  });

  // Function to update the cart
  function ToCart(foodNameClicked, foodQuantity, isVeg, singleFoodAmount) {
    let foodAlreadyThere = false;
    let foodPos;
    let node;
    if (isVeg) {
      node = '<img class="vegIcon" src="./images/veg.webp" alt="" />';
    } else {
      node = '<img class="nonVegIcon" src="./images/non-veg.webp" alt="" />';
    }
    for (var i = 0; i < food.length; i++) {
      if (food[i][0] === foodNameClicked) {
        foodAlreadyThere = true;
        foodPos = i;
        break;
      } else {
        foodAlreadyThere = false;
      }
    }

    if (foodAlreadyThere) {
      food.splice(foodPos, 1);
      food.push([foodNameClicked, foodQuantity, singleFoodAmount, node]);
    } else {
      food.push([foodNameClicked, foodQuantity, singleFoodAmount, node]);
    }

    for (var i = 0; i < food.length; i++) {
      if (food[i][1] === 0) {
        food.splice(i, 1);
      }
    }

    if (food.length !== 0) {
      $(".shoppingCart").addClass("shoppingCartWithItems");

      $(".cartContentDiv").empty();
      for (var i = 0; i < food.length; i++) {
        let cartTxt =
          '<div class="row cartContentRow"><div class="col-10"><div style="display:flex;"><p>' +
          food[i][0] +
          '</p> <p class="text-muted-small">' +
          food[i][3] +
          '<p></div><i class="fas fa-rupee-sign"> ' +
          food[i][2] +
          '</i></p>  </div>  <div class="col-2"> <p class="text-muted-small" > <i class="fas fa-rupee-sign"></i> ' +
          food[i][1] * food[i][2] +
          '</p>  <span class="cartQuantity"> ' +
          " <span> Qty : </span>" +
          food[i][1] +
          '</span> </div>  </div> <hr class="cartHr">';
        $(".cartContentDiv").append(cartTxt);
      }
    } else {
      $(".shoppingCart").removeClass("shoppingCartWithItems");

      $(".cartContentDiv").empty();
      $(".cartContentDiv").append(
        '<h1 class="text-muted">Your Cart is Empty</h1>'
      );
    }

    $(".shoppingCartAfter").text(food.length);
    if (food.length === 0) {
      totalAmount = 0;
    } else {
      totalAmount = totalAmount + singleFoodAmount;
    }
    $(".totalAmountDiv").empty();
    $(".totalAmountDiv").append(
      '<span class="totalAmountText">TOTAL AMOUNT : </span><br/>' +
        '<i class="fas fa-rupee-sign"></i> ' +
        totalAmount
    );
  }
});

// Function to open WhatsApp for checkout
function openWhatsapp() {
  if ($("#address")[0].value === "") {
    alert("Please Enter Address");
    return;
  } else {
    let total = 0;
    let address = $("#address")[0].value;
    let note = $("#note")[0].value;
    let wTxt = "*name*               *quantity* \n";

    for (var i = 0; i < food.length; i++) {
      let name = food[i][0];
      let quantity = food[i][1];
      total = total + food[i][1] * food[i][2];
      wTxt = wTxt + name + "      " + quantity + "  \n";
    }

    if ($("#note")[0].value === "") {
      wTxt =
        wTxt + "\n *Total Bill: " + total + "*" + "\n\n Address: " + address;
    } else {
      wTxt =
        wTxt +
        "\n *Total Bill: " +
        total +
        "*" +
        "\n\n Address: " +
        address +
        "\n Note: " +
        note;
    }

    let wTxtEncoded = encodeURI(wTxt);
    window.open("https://wa.me/917428789065?text=" + wTxtEncoded);
  }
}