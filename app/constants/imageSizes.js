// Consistent image sizing across the application

export const IMAGE_SIZES = {
  // Recipe cards in Featured section and recipes page
  RECIPE_CARD: {
    width: 240,      // pixels
    height: 200,     // pixels for the image container
    cardMinHeight: 360  // total card height when with 3D transforms
  },

  // Recipe detail page hero image
  RECIPE_DETAIL: {
    aspectRatio: '1/1',  // Square format
    maxWidth: '100%'
  },

  // Hero/Logo images
  LOGO: {
    width: 400,
    height: 160
  }
};
