import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../../types/Post";
import { Card } from "../../types/Card";
import { useTranslation } from 'react-i18next';

type ProgressItem = {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
};

const LearnApp = () => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const { id } = useParams();
  const [post, setPost] = useState<Post>();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [session, setSession] = useState<ProgressItem[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [translationVisible, setTranslationVisible] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const handleKnow = () => {
    setTranslationVisible(false);
    const newSession = [...session];
    newSession[currentCard].learned = true;
    setSession(newSession);
    setCurrentCard(currentCard + 1);
    
    if (currentCard >= session.length - 1) {
      setSessionFinished(true);
    }
  };

  const handleDontKnow = () => {
    setTranslationVisible(false);
    const newSession = [...session];
    setSession(newSession);
    setCurrentCard(currentCard + 1);

    if (currentCard >= session.length - 1) {
      setSessionFinished(true);
    }
  };

  const handleLeave = () => {
    updateProgress();
    navigate(-1);
  }

  const handleRestartSession = async () => {
    updateProgress();
    setSession((prevSession) => {
      const newSession = prevSession.filter((card) => !card.learned);
      return newSession;
    });
    setCurrentCard(0);
    setSessionFinished(false);
  };
  

  const totalLearned = () => {
    return (
      progress.length -
      session.length +
      session.filter((card) => card.learned).length
    );
  };

  const widthProgressBar = () => {
    return `${(totalLearned() / progress.length) * 100}%`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      const postResponse = await fetch(`${apiUrl}/api/posts/${id}`);

      if (!postResponse.ok) {
        console.error("Failed to fetch post");
        return;
      }

      const post = await postResponse.json();
      setPost(post);
    };

    fetchPost();
  }, [apiUrl, token, id]);

  useEffect(() => {
    const fetchProgress = async () => {
      const learnResponse = await fetch(`${apiUrl}/api/learn/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!learnResponse.ok) {
        console.error("Failed to fetch progress");
        return;
      }

      const learn = await learnResponse.json();

      if (!learn) {
        return;
      }
      
      learn.progress = post?.cards.map((card: Card) => {
        const foundCard = learn.progress?.find((c: ProgressItem) => c.id === card.id);

        return {
          id: card.id,
          word: card.word,
          translation: card.translation,
          learned: foundCard?.learned ?? false,
        };
      }) || [];
      

      setProgress(learn.progress);

      const session = learn.progress.filter(
        (card: ProgressItem) => !card.learned
      ).map((card: ProgressItem) => ({
        id: card.id,
        word: card.word,
        translation: card.translation,
        learned: false,
      }));
      setSession(session);
    };

    fetchProgress();
  }, [apiUrl, id, post, token]);

  const updateProgress = async () => {
    const newProgress = progress.map((card) => ({
      id: card.id,
      word: card.word,
      translation: card.translation,
      learned: card.learned || session.find((c) => c.id === card.id)?.learned || false,
    }));

    console.log(newProgress)
    const response = await fetch(`${apiUrl}/api/learn/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        progress: newProgress,
      }),
    });

    setProgress(newProgress);

    if (!response.ok) {
      console.error("Failed to update progress");
      return;
    }
  };

  return !sessionFinished ? (
    <div className="relative p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">{t('learnWords')}</h1>

      <div className="flex flex-col items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-purple-500 h-full w-0 transition-all duration-500 ease-in-out"
            style={{ width: widthProgressBar() }}
          ></div>
        </div>
        <span className="text-gray-600">
          {t('learned')}: {totalLearned()}/{progress.length}
        </span>
      </div>

      <div className="p-8 bg-purple-200 rounded-lg text-center h-32 flex flex-col justify-between">
        <h2 className="text-lg font-semibold">{session[currentCard]?.word}</h2>

        {translationVisible && (
          <div className="text-gray-600 transition-opacity duration-500 opacity-0 animate-fade-in">
            {session[currentCard]?.translation}
          </div>
        )}
      </div>

      {translationVisible ? (
        <div className="flex justify-between space-x-6">
          <button className="green-button" onClick={handleKnow}>
            {t('iKnow')}
          </button>
          <button className="red-button" onClick={handleDontKnow}>
            {t('dontKnow')}
          </button>
        </div>
      ) : (
        <div>
          <button
            className="primary-button"
            onClick={() => setTranslationVisible(true)}
          >
            {t('showTranslation')}
          </button>
        </div>
      )}

      <button className="absolute top-4 right-4 cursor-pointer" onClick={handleLeave}>✖</button>
    </div>
  ) : (
    <div className="relative p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center space-y-4">
      <h1 className="text-3xl font-extrabold text-purple-600">🎉 {t('goodJob')} 🎉</h1>

      {totalLearned() === progress.length ? (
        <p className="text-lg text-gray-700">
          You have completed this quiz!
        </p>      
      ) : (
        <p className="text-lg text-gray-700">
          {t('youHaveLearnedNewWords1')} <span className="font-bold text-purple-500">{totalLearned() - progress.filter(card => card.learned).length}</span> {t('youHaveLearnedNewWords2')}
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-purple-500 h-full w-0 transition-all duration-500 ease-in-out"
            style={{ width: widthProgressBar() }}
          ></div>
        </div>
        <span className="text-gray-600">
          {t('learned')}: {totalLearned()}/{progress.length}
        </span>
        
        <button className="absolute top-4 right-4 cursor-pointer" onClick={handleLeave}>✖</button>
      </div>
      
      <div className="flex justify-between space-x-6">
        {totalLearned() !== progress.length &&
          <button className="green-button" onClick={handleRestartSession}>{t('continue')}</button>
        }

        <button className="red-button" onClick={handleLeave}>{t('goBack')}</button>
      </div>
    </div>
  );
};

export default LearnApp;
