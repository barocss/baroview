export type LayoutType =
  | 'row'
  | 'column'
  | 'columns'
  | 'grid'
  | 'sidebar'
  | 'gallery'
  | 'image-gallery'
  | 'masonry';

export type GalleryStyle =
  | 'uniform'
  | 'masonry'
  | 'carousel'
  | 'strip'
  | 'list'
  | 'bento'
  | 'billboard'
  | 'slides';

export interface BaroViewItemData {
  url: string;
  title?: string;
  content?: string;
  contentType?: 'text' | 'code' | 'markdown';
  [key: string]: string | undefined;
}
