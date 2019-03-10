// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Copyright (c) 2013 Intel Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

package org.xwalk.runtime.client.embedded.test;

import android.test.suitebuilder.annotation.SmallTest;

import org.chromium.base.test.util.DisabledTest;
import org.chromium.base.test.util.Feature;
import org.xwalk.runtime.client.embedded.shell.XWalkRuntimeClientEmbeddedShellActivity;
import org.xwalk.test.util.RuntimeClientApiTestBase;

/**
 * Test suite for W3C Screen Orientation API.
 */
public class ScreenOrientationTest extends XWalkRuntimeClientTestBase {
    @SmallTest
    @Feature({"ScreenOrientationTest"})
    public void testScreenOrientation() throws Throwable {
        RuntimeClientApiTestBase<XWalkRuntimeClientEmbeddedShellActivity> helper =
                new RuntimeClientApiTestBase<XWalkRuntimeClientEmbeddedShellActivity>(
                        getTestUtil(), this);
        helper.testScreenOrientation();
    }
}
