import { useRef, useState, useEffect } from "react";
import HeaderCSS from "./App.module.css";
import {
  FaRedo,
  FaStepBackward,
  FaStepForward,
  FaPlay,
  FaPause,
  FaRandom,
} from "react-icons/fa";
import MusicItem from "./MusicItem";
import { data } from "./data";
import { useSpring, animated } from "react-spring";

function App() {
  const cd = useRef();
  const audio = document.getElementById("audio");
  const au = useRef();
  const progress = document.getElementById("progress");
  // eslint-disable-next-line
  const [songs, setsongs] = useState(data.songs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cdWidth, setCdWidth] = useState(0);
  const [isPlay, setIsPlay] = useState(true);
  const [isRedo, setIsRedo] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const styles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    config: { duration: 10000 },
    pause: isPlay,
  });

  const audioPlay = () => {
    setIsPlay(!isPlay);
    if (isPlay) audio.play();
    else audio.pause();
  };

  const audioRedo = () => {
    if (isRedo) {
      setIsRedo(false);
      audio.loop = false;
    } else {
      setIsRedo(true);
      audio.loop = true;
    }
  };

  const audioRandom = () => {
    if (isRandom) {
      setIsRandom(false);
    } else {
      setIsRandom(true);
    }
  };

  const onTimeUpDate = function () {
    if (audio.duration) {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    }
  };

  const audioSeek = (e) => {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
  };
  const audioStart = () => {
    setTimeout(() => {
      audio.play();
      setIsPlay(false);
    }, 500);
  };

  useEffect(() => {
    console.log(au.current.offsetWidth);

    setCdWidth(cd.current.offsetWidth);
  }, []);
  useEffect(() => {
    const documentScroll = () => {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.current.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.current.style.height = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.current.style.opacity = newCdWidth / cdWidth;
    };
    window.addEventListener("scroll", documentScroll);
  }, [cdWidth]);
  const checkNumber = (currentIndex) => {
    if (currentIndex > songs.length - 1) {
      return 0;
    }
    if (currentIndex < 0) {
      return songs.length - 1;
    }
    return currentIndex;
  };
  const nextSong = () => {
    if (isRandom === false) {
      setCurrentIndex((currentIndex) => {
        let newSong = currentIndex + 1;
        return checkNumber(newSong);
      });
    } else {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * songs.length);
      } while (newIndex === currentIndex);

      setCurrentIndex(newIndex);
    }
    setIsPlay(true);
    audioStart();
    progress.value = 0;
  };
  const prevSong = () => {
    if (isRandom === false) {
      setCurrentIndex((currentIndex) => {
        let newSong = currentIndex - 1;
        return checkNumber(newSong);
      });
    } else {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * songs.length);
      } while (newIndex === currentIndex);

      setCurrentIndex(newIndex);
    }
    setIsPlay(true);
    audioStart();
    progress.value = 0;
  };

  const setIndex = (index) => {
    setCurrentIndex(index);
    audioStart();
  };
  // const scrollTo = (currentIndex) =>{
  //   if( currentIndex > 2 ){
  //     return -100
  //   }
  // }

  return (
    <div className={`${HeaderCSS.App}`}>
      <section className={HeaderCSS.music__container}>
        <h4 className={HeaderCSS.music__title}>Now Playing:</h4>
        <h2 className={HeaderCSS.music__name}>{songs[currentIndex].name}</h2>
        <div className={HeaderCSS.music__cd} ref={au}>
          <animated.div style={{ ...styles }}>
            <img
              id="cd"
              className={HeaderCSS.music__cd__thumb}
              src={songs[currentIndex].image}
              alt=""
              ref={cd}
            />
          </animated.div>
        </div>

        <div className={HeaderCSS.music__controllers__btn}>
          <div
            className={
              isRedo
                ? `${HeaderCSS.music__redo__btn}  ${HeaderCSS.active}`
                : `${HeaderCSS.music__redo__btn}`
            }
            onClick={audioRedo}
          >
            <FaRedo />
          </div>
          <div className={HeaderCSS.music__prev__btn} onClick={prevSong}>
            <FaStepBackward />
          </div>
          <div
            className={HeaderCSS.music__toggle__play__btn}
            onClick={audioPlay}
          >
            {isPlay ? <FaPlay /> : <FaPause />}
          </div>
          <div className={HeaderCSS.music__next__btn} onClick={nextSong}>
            <FaStepForward />
          </div>
          <div
            className={
              isRandom
                ? `${HeaderCSS.music__random__btn}  ${HeaderCSS.active}`
                : `${HeaderCSS.music__random__btn}`
            }
            onClick={audioRandom}
          >
            <FaRandom />
          </div>
        </div>
        <input
          id="progress"
          className={HeaderCSS.music__progress}
          type="range"
          defaultValue="0"
          step="1"
          min="0"
          max="100"
          onChange={audioSeek}
        />
        <audio
          id="audio"
          src={songs[currentIndex].path}
          onTimeUpdate={onTimeUpDate}
          onEnded={nextSong}
        />
      </section>

      <section className={HeaderCSS.music__playlist}>
        {songs.map((song, index) => {
          return (
            <MusicItem
              key={index}
              {...song}
              currentIndex={currentIndex}
              songIndex={index}
              setCurrentIndex={() => setIndex(index)}
            />
          );
        })}
      </section>
    </div>
  );
}

export default App;
