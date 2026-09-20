import ExpoModulesCore
import AVFoundation

public class GroveVolumeModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GroveVolume")
    AsyncFunction("getOutputVolume") { () -> Double in
      return Double(AVAudioSession.sharedInstance().outputVolume)
    }
  }
}
