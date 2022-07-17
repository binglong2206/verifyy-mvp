import create from "zustand";

interface User {
  username: string;
  email: string;
  setUserState: (email: string, username?: string) => void;
}


interface YT_account {
  id: number
  subscriber_count: number,
  upload_count: number,
  demographics: any[],
  geographcis: any[],
  medias: any[],
}

type SetYoutube = ({id,subscriber_count,upload_count,demographics,geographcis,medias}: YT_account) => void

interface IG_account {
  id: number,
  username: number,
  follower_count: number,
  media_count: number,
  demographics: any[],
  geographcis: any[],
  medias: any[],
}

interface FB_account {
  id: number,
  follower_count: number,
  like_count: number,
  media_count: number,
  demographics: any[],
  geographcis: any[],
  medias: any[],
}



// Set(state => {...}) -> use state if you want access to prev state
// If not, set({...}) directly will suffice
export const useUserStore = create<User>()((set) => ({
  username: "",
  email: "",

  setUserState: (email: string, username?: string): void => {
    set({
      username: username,
      email: email,
    });
  },
}));

interface Dog {
  cat: number
}

export const useYoutubeStore = create<YT_account>()((set)=> ({
  id: 0,
  subscriber_count: 0,
  upload_count: 0,
  demographics: [],
  geographcis: [],
  medias: [],

  setYoutube: (props: YT_account):void => {
    for (let key in props) {
      set({
        [key]: props[key as keyof YT_account] // woohoo!
      })
    }
  }

}))


export const useInstagramStore = create<IG_account>()((set)=> ({
  id: 2,
  username: 0,
  follower_count: 0,
  media_count: 0,
  demographics: [],
  geographcis: [],
  medias: [],
  setInstagram: ({id,username,follower_count,media_count,demographics,geographcis,medias}: IG_account):void => {
    set({})
  }
}))

export const useFacebookStore = create<FB_account>()((set)=> ({
  id: 8,
  follower_count: 0,
  like_count: 0,
  media_count: 0,
  demographics: [],
  geographcis: [],
  medias: [],
  setFacebook: ({id,follower_count,like_count,media_count,demographics,geographcis,medias}: FB_account): void => {
    set({})
  }
}))
