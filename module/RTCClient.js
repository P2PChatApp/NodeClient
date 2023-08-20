/**
 * WebRTC Client
 */
module.exports = class RTCClient{
  /**
   * RTCPeerConnection作成
   * @param {Number} clientId 相手のClientID
   */
  constructor(clientId){
    this.clientId = clientId;

    this.rtc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ]
    });
  }

  /**
   * 経路情報を取得しオファーを作成
   * @returns {RTCSessionDescriptionInit} オファーデータ
   */
  async createOffer(){
    const offer = await this.rtc.createOffer();
    await this.rtc.setLocalDescription(offer);

    await this.getCandidates();
    return this.rtc.localDescription;;
  }

  /**
   * 経路情報を取得しアンサーを作成
   * @param {RTCSessionDescriptionInit} offer 相手のオファーデータ
   * @returns {RTCSessionDescriptionInit} アンサーデータ
   */
  async createAnswer(offer){
    await this.rtc.setRemoteDescription(offer);

    await this.getCandidates();

    const answer = await this.rtc.createAnswer();
    await this.rtc.setLocalDescription(answer);
    return this.rtc.localDescription;
  }

  /**
   * 経路が全て見つかるまで待機する
   * @returns {Void}
   */
  async getCandidates(){
    return await new Promise(resolve=>{
      this.rtc.addEventListener("icecandidate",async(event)=>{
        if(event.candidate === null) resolve();
      });
    })
  }
}