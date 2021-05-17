import axios, { AxiosResponse } from 'axios';

export default function packageJson(
  name: string,
  registry: string
): Promise<string> {
  return axios.get(`${registry}/${name}`)
    .then((response: AxiosResponse) => {
      const { data } = response || { 'dist-tags': '' };
      const version = data['dist-tags'].latest;
      return version;
    })
    .catch((err: object) => {
      return err;
    });
}
