import { AMAP_STYLE } from '@/constants';

export const createMap = (dom: HTMLElement, AMap: any, option = {}) => {
  return new AMap.Map(dom, {
    viewMode: '3D',
    pitch: 40,
    zoom: 6,
    mapStyle: AMAP_STYLE,
    center: [117.190182, 39.125596],
    terrain: true,
    showLabel: true,
    ...option
  });
};

export const createPoints = (loca: any, data: any, option = {}) => {
  // 呼吸点
  // @ts-ignore
  const scatter = new Loca.ScatterLayer({ loca });

  // @ts-ignore
  const pointGeo = new Loca.GeoJSONSource({ data });
  scatter.setSource(pointGeo);

  scatter.setStyle({
    unit: 'px',
    size: [40, 40],
    borderWidth: 0,
    duration: 2000,
    animate: true,
    ...option
  });

  return scatter;
};

export const createLines = (loca: any, data: any, option = {}) => {
  // @ts-ignore
  const pulseLink = new Loca.PulseLinkLayer({ loca });

  // @ts-ignore
  const lineGeo = new Loca.GeoJSONSource({ data });
  pulseLink.setSource(lineGeo);

  pulseLink.setStyle({
    unit: 'px',

    // 弧度设置
    // @ts-ignore
    height: (_, feat) => feat.distance / 3,
    maxHeightScale: 0.4, // 弧顶位置比例

    // 连接线设置
    lineColors: () => ['#ffff54', '#ffff54', '#0a21ef'],
    lineWidth: () => [2, 1],

    // 脉冲点设置
    // @ts-ignore
    speed: (_, prop) => prop.distance / 10000,
    flowLength: 20,
    headColor: '#0a21ef',
    trailColor: '#ffffff',
    ...option
  });

  return pulseLink;
};

export const pointFeatureCollectionToData = (featureCollection: any) => {
  return featureCollection.features.map((el: any, index: number) => {
    return {
      name: '名称',
      address: '地址名称',
      index: index++,
      scenicCount: Math.round(Math.random() * 5),
      photoCount: Math.round(Math.random() * 50),
      consume: Math.round(Math.random() * 5000),
      lnglat: el.geometry.coordinates,
      finished: index < 600
    };
  });
};

export const dataToPointFeatureCollection = (data: any[]) => {
  return {
    type: 'FeatureCollection',
    features: data.map((el) => {
      return {
        type: 'Feature',
        properties: el,
        geometry: {
          type: 'Point',
          coordinates: el.lnglat
        }
      };
    })
  };
};

export const dataToLineFeatureCollection = (data: any[]) => {
  return {
    type: 'FeatureCollection',
    features: data
      .filter((el) => el.finished)
      .map((el, index) => {
        const prevLnglat = index > 0 ? data[index - 1].lnglat : el.lnglat;

        return {
          type: 'Feature',
          properties: el,
          geometry: {
            type: 'LineString',
            coordinates: [prevLnglat, el.lnglat]
          }
        };
      })
  };
};
