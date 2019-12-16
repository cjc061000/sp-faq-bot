/// <reference path="luisactions.js" />

jQuery(
    function () {
        $('#QueryText').on('keydown', function (e) {
            if (e.which === 13) {
                QueryTextEnter();
            }
        });
        function PostGreeting() {
            PostResponse("Hello there! <img height='50' src='https://i.kym-cdn.com/entries/icons/original/000/029/079/hellothere.jpg' ></img>");
        }
        $(document).ready(function () { PostGreeting(); });
    }
);