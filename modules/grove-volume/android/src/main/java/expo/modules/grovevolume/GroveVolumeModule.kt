package expo.modules.grovevolume

import android.content.Context
import android.media.AudioManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GroveVolumeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GroveVolume")
    AsyncFunction("getOutputVolume") {
      val manager = appContext.reactContext?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
      if (manager == null) null else {
        val maximum = manager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
        if (maximum <= 0) null else manager.getStreamVolume(AudioManager.STREAM_MUSIC).toDouble() / maximum
      }
    }
  }
}
