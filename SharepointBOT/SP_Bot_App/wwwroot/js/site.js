/// <reference path="luisactions.js" />

jQuery(
    function () {
        $('#QueryText').on('keydown', function (e) {
            if (e.which === 13) {
                QueryTextEnter();
            }
        });
    }
);