"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nombre = "Sergio";
var apellido = "Hidalgo";

var Perro = function () {
    function Perro(nombreAnimal) {
        _classCallCheck(this, Perro);

        this.nombreAnimal = nombreAnimal;
    }

    _createClass(Perro, [{
        key: "nombre",
        value: function nombre() {
            console.log("El nombre es " + this.nombreAnimal);
        }
    }]);

    return Perro;
}();

var perro = new Perro("Dandy");
perro.nombre();
