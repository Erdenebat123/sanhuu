// delgesttei ajillah controller
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container"
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    deleteListItem: function(id){
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },

    clearFeilds: function () {
      var feilds = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      var feildsArr = Array.prototype.slice.call(feilds);
      feildsArr.forEach((el) => {
        el.value = "";
      });

      feildsArr[0].focus();
    },
    tusuviigUzuuleh: function(tusuv){
     document.querySelector(DOMstrings.tusuvLabel).textContent = tusuv.tusuv;
     document.querySelector(DOMstrings.incomeLabel).textContent = tusuv.totalInc;
     document.querySelector(DOMstrings.expenseLabel).textContent = tusuv.totalExp;
     if(tusuv.huvi !== 0){
     document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + "%";
     }
     else{
        document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
     }
    }
  };
})();



// sanhuutei ajillah controller
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    var sum = 0;
    data.items[type].forEach((el)=> {
      sum += el.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,

    huvi: 0
  };

  return {
    tusuvTootsooloh: function () {
      calculateTotal("inc");
      calculateTotal("exp");
      data.tusuv = data.totals.inc - data.totals.exp;
      
      data.huvi = Math.round(data.totals.exp / data.totals.inc * 100);
    },
    tusviigAvah: function(){   
      return{
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      }

    },
    deleteItem: function(type,id){
      var ids = data.items[type].map(function(el){
        return el.id;

    }); 
    var index = ids.indexOf(id)

    if(index !== -1){
      data.items[type].splice(index,1)
    }
  },

    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);

      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();



//programiig holboh controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      uiController.addListItem(item, input.type);
      uiController.clearFeilds();
      updateTusuv();

    };
  };
  var updateTusuv = function(){
    financeController.tusuvTootsooloh();
    var tusuv = financeController.tusviigAvah();
    uiController.tusuviigUzuuleh(tusuv); 
    };

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });
    document.addEventListener("keyup", function (event) {
      if (event.key === "Enter" && event.code === "Enter") {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.containerDiv).addEventListener("click", function(event){
    var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(id){
      var arr = id.split("-");
      var type = arr[0];
      var itemId = parseInt(arr[1]);


    financeController.deleteItem(type,itemId);
    uiController.deleteListItem(id);
    updateTusuv();
    }
    
    
    })
  };
  return {
    init: function () {
      uiController.tusuviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      })
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
