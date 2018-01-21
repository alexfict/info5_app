import { Cluster } from './cluster.class';
import { LatLng } from 'leaflet';

describe('ClusterClass', () => {

  let cluster:Cluster;

  beforeEach(() => {
    // create cluster object with dummy data
    cluster = new Cluster([50.775, 6.084], 1000, 3, 45, 50, 150);
  });

  it('should create an instance of Cluster', () => {
    expect(cluster).toBeTruthy();
  });

  it('should have an instance of Cluster with set values', () => {
    expect(cluster.position).toEqual(new LatLng(50.775, 6.084));
    expect(cluster.distance).toEqual(1000);
    expect(cluster.zoomLevel).toEqual(3);
    expect(cluster.degree).toEqual(45);
    expect(cluster.color).toEqual('red');
  });

  it('should adjust the square color according to the number of occupied slots', () => {
    cluster = new Cluster([50.775, 6.084], 1000, 3, 45, 100, 150);
    expect(cluster.color).toEqual('yellow');
    cluster = new Cluster([50.775, 6.084], 1000, 3, 45, 140, 150);
    expect(cluster.color).toEqual('green');
  });

});
