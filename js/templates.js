
var answer;
var character_selection;
var confirm;
var death;
var game;
var victory;



answer = `<div id="title"><a href="answer">1-2-3</a></div>`;

character_selection = 
	`<!-- <img src="img/ground.png" alt="ground" id="ground"> -->
		<div id="character_selection_container">
			<!-- <div id="bg1"></div> -->

			<div id="start">
				<div id="sel_title">Choose Your Character</div>
				<div id="start_main">
					<img id="left_arrow" alt="left_arrow" src="img/arrow.png">
					<!-- <i class="left_arrow"></i> -->
					<div id="char_stats">
						<div id="name"></div>
						<div id="name_placeholder"></div>
						<span>Attack</span>
						<div id="attack"></div>
						<span>Defense</span>
						<div id="defense"></div>
						<span>Speed</span>
						<div id="speed"></div>
						<span>Special</span>
						<div id="special"></div>
					</div>
					<div id="character_container">
						<div id="sel_character"></div>
						<div id="select">SELECT</div>
					</div>
					<img id="right_arrow" alt="right_arrow" src="img/arrow.png">
				</div>
			</div>
		</div>`;

confirm = 
	`<div id="confirm_container">
		<div id="prompt">Are you sure?</div>
		<img alt="character" id="conf_character">
		<div id="conf_answer">
			<span id="yes">Yes</span>
			&nbsp; &nbsp; &nbsp; &nbsp;
			<span id="no">No</span>
		</div>
	</div>
	<audio id="charSound">
	</audio>`;

death = `<div id="title"><a href="answer">YOU LOSE</a></div>`;

game = 
	`<div id="game_container">
			<div class="bg" id="bg1"></div>
			<div class="bg" id="bg2"></div>
			<div class="bg" id="bg3"></div>
			<div class="bg" id="bg4"></div>
			<div class="bg" id="bg5"></div>
			<div class="bg" id="ground"></div>
			<div class="bg" id="ground-over"></div>
			<div id="game_character"></div>			
			<div id="hintbox_cont"></div>
			<div id="howto_cont">
				Press Enter to Begin.
				<br><br>
				Skins don't affect gameplay and are purely cosmetic.
			</div>
		</div>
		<audio id="music">
			<source src="sound/music.m4a" type="audio/m4a">
			<source src="sound/music.m4a" type="audio/x-m4a">
			<source src="sound/music.m4a" type="audio/m4a-latm">
		</audio>
		<audio id="correct">
			<source src="sound/effects/correct.mp3" type="audio/mp3">
		</audio>`;

victory = `<div id="title"><a href="answer">VICTORY</a></div>`;