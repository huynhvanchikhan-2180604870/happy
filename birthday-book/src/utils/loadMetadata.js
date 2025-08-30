export const loadMetadata = async () => {
  try {
    const response = await fetch('/metadata.json');
    if (!response.ok) {
      throw new Error('Failed to load metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading metadata:', error);
    // Return default metadata if loading fails
    return {
      girlfriendName: "Em Yêu",
      birthdayDate: "2025-09-01",
      age: 22,
      greeting: {
        vi: {
          title: "Chúc Mừng Sinh Nhật!",
          subtitle: "22 tuổi",
          message: ["Chúc em sinh nhật vui vẻ!"]
        }
      },
      photos: [],
      music: {
        playlist: [],
        autoplay: false,
        loop: true,
        shuffle: false,
        defaultVolume: 0.7
      },
      theme: "romantic",
      particles: {
        enabled: true,
        type: "hearts",
        count: 15,
        speed: "slow"
      }
    };
  }
};